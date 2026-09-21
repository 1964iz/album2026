import { PhotoItem, AlbumConfig } from '../types';
import { INITIAL_PHOTOS } from '../data/initialPhotos';
import { getDb } from '../firebase';
import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  writeBatch,
  query,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';

const DB_NAME = 'StudioIA_AlbumDB';
const STORE_NAME = 'photos';
const DB_VERSION = 1;
const FIRESTORE_COLLECTION = 'photos';
const CONFIG_STORAGE_KEY = 'studio_ia_album_config';

export const DEFAULT_ALBUM_CONFIG: AlbumConfig = {
  studioName: 'Studio IA',
  coupleName: 'Novo Casal',
  modelName: 'Modelo Principal',
  subtitle: 'Álbum & Portfólio Fotográfico de Alta Costura | Memórias & Momentos Eternos',
};

export function loadStoredAlbumConfig(): AlbumConfig {
  try {
    const raw = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        studioName: parsed.studioName || DEFAULT_ALBUM_CONFIG.studioName,
        coupleName: parsed.coupleName ?? DEFAULT_ALBUM_CONFIG.coupleName,
        modelName: parsed.modelName ?? DEFAULT_ALBUM_CONFIG.modelName,
        subtitle: parsed.subtitle ?? DEFAULT_ALBUM_CONFIG.subtitle,
      };
    }
  } catch (e) {
    console.warn('Error reading stored album config', e);
  }
  return DEFAULT_ALBUM_CONFIG;
}

export function saveStoredAlbumConfig(config: AlbumConfig): void {
  try {
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
  } catch (e) {
    console.warn('Error saving album config', e);
  }
}

// --- Local IndexedDB Cache ---
function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof indexedDB === 'undefined') {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function savePhotosToLocal(photos: PhotoItem[]): Promise<void> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    await store.clear();
    for (const p of photos) {
      await store.put(p);
    }
  } catch (err) {
    console.warn('Could not save to IndexedDB cache:', err);
  }
}

export async function loadPhotosFromLocal(): Promise<PhotoItem[] | null> {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();
    return new Promise((resolve) => {
      request.onsuccess = () => {
        const result = request.result as PhotoItem[];
        if (result && result.length > 0) {
          resolve(result);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => resolve(null);
    });
  } catch {
    return null;
  }
}

// --- Cloud Firestore Integration ---

/**
 * Loads photos, prioritizing Cloud Firestore with seamless fallback to IndexedDB and INITIAL_PHOTOS.
 * Guarantees that existing inserted photos are preserved and synced to the database.
 */
export async function loadPhotosFromStorage(): Promise<PhotoItem[]> {
  // 1. Try local cache first for instant UI response
  const localPhotos = await loadPhotosFromLocal();

  try {
    const db = getDb();
    if (!db) {
      return localPhotos && localPhotos.length > 0 ? localPhotos : INITIAL_PHOTOS;
    }

    const photosRef = collection(db, FIRESTORE_COLLECTION);
    const q = query(photosRef, orderBy('order', 'asc'));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const cloudPhotos: PhotoItem[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        cloudPhotos.push({
          id: data.id || docSnap.id,
          title: data.title || '',
          subtitle: data.subtitle || '',
          category: data.category || 'casal',
          date: data.date || '',
          location: data.location || '',
          src: data.src || '',
          description: data.description || '',
          isFavorite: data.isFavorite ?? false,
          aspectRatio: data.aspectRatio || 'portrait',
          quote: data.quote || '',
          order: data.order ?? cloudPhotos.length,
        });
      });

      // Update local cache
      await savePhotosToLocal(cloudPhotos);
      return cloudPhotos;
    }

    // Firestore is empty: Seed with existing local photos if present, or INITIAL_PHOTOS
    const photosToSeed = (localPhotos && localPhotos.length > 0) ? localPhotos : INITIAL_PHOTOS;
    await syncPhotosToFirestore(photosToSeed);
    await savePhotosToLocal(photosToSeed);
    return photosToSeed;
  } catch (err) {
    console.warn('Firestore connection fallback to local cache:', err);
    return localPhotos && localPhotos.length > 0 ? localPhotos : INITIAL_PHOTOS;
  }
}

/**
 * Syncs an entire list of photos to Firestore and IndexedDB
 */
export async function savePhotosToStorage(
  photos: PhotoItem[],
  onProgress?: (current: number, total: number) => void
): Promise<void> {
  // Always save to IndexedDB immediately
  await savePhotosToLocal(photos);

  // Sync to Firestore reliably
  try {
    await syncPhotosToFirestore(photos, onProgress);
  } catch (err) {
    console.error('Failed to sync photos to Firestore:', err);
  }
}

/**
 * Updates a single photo in Firestore and local cache
 */
export async function saveSinglePhotoToStorage(photo: PhotoItem): Promise<void> {
  try {
    const local = (await loadPhotosFromLocal()) || [];
    const updated = local.map((p) => (p.id === photo.id ? photo : p));
    await savePhotosToLocal(updated);

    const db = getDb();
    if (db) {
      const docRef = doc(db, FIRESTORE_COLLECTION, photo.id);
      await setDoc(docRef, {
        ...photo,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    }
  } catch (err) {
    console.error('Failed to save single photo to Firestore:', err);
  }
}

/**
 * Deletes a single photo from Firestore and local cache
 */
export async function deletePhotoFromStorage(id: string): Promise<void> {
  try {
    const local = (await loadPhotosFromLocal()) || [];
    const filtered = local.filter((p) => p.id !== id);
    await savePhotosToLocal(filtered);

    const db = getDb();
    if (db) {
      const docRef = doc(db, FIRESTORE_COLLECTION, id);
      await deleteDoc(docRef);
    }
  } catch (err) {
    console.error('Failed to delete photo from Firestore:', err);
  }
}

/**
 * Robust synchronization to Firestore:
 * Writes each document individually to prevent hitting Firestore 10MB batch size limits
 * and provides progress updates. Also cleans up removed photos.
 */
export async function syncPhotosToFirestore(
  photos: PhotoItem[],
  onProgress?: (current: number, total: number) => void
): Promise<void> {
  const db = getDb();
  if (!db) return;

  const validPhotos = photos.filter((p) => Boolean(p.src));
  const newIds = new Set(validPhotos.map((p) => p.id));

  // 1. Write photos individually to bypass transaction size limits
  for (let i = 0; i < validPhotos.length; i++) {
    const photo = validPhotos[i];
    const photoId = photo.id || `photo-${i}`;
    const docRef = doc(db, FIRESTORE_COLLECTION, photoId);

    try {
      await setDoc(docRef, {
        id: photoId,
        title: photo.title || 'Momento Studio IA',
        subtitle: photo.subtitle || '',
        category: photo.category || 'casal',
        date: photo.date || '',
        location: photo.location || '',
        src: photo.src || '',
        description: photo.description || '',
        isFavorite: photo.isFavorite ?? false,
        aspectRatio: photo.aspectRatio || 'portrait',
        quote: photo.quote || '',
        order: photo.order ?? i,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    } catch (docErr) {
      console.warn(`Error writing photo ${photoId} to Firestore:`, docErr);
    }

    if (onProgress) {
      onProgress(i + 1, validPhotos.length);
    }
  }

  // 2. Clean up old documents that are no longer part of the album
  try {
    const snapshot = await getDocs(collection(db, FIRESTORE_COLLECTION));
    for (const d of snapshot.docs) {
      if (!newIds.has(d.id)) {
        await deleteDoc(d.ref).catch(() => {});
      }
    }
  } catch (cleanupErr) {
    console.warn('Optional cleanup error:', cleanupErr);
  }
}

/**
 * Downloads a complete JSON backup file of all photos and metadata.
 */
export function exportAlbumBackup(photos: PhotoItem[]): void {
  const json = JSON.stringify(photos, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `album-studio-ia-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Real-time listener for album photos across tabs/devices
 */
export function subscribeToPhotos(onUpdate: (photos: PhotoItem[]) => void): () => void {
  const db = getDb();
  if (!db) return () => {};

  try {
    const photosRef = collection(db, FIRESTORE_COLLECTION);
    const q = query(photosRef, orderBy('order', 'asc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        const photos: PhotoItem[] = [];
        snapshot.forEach((docSnap) => {
          const data = docSnap.data();
          photos.push({
            id: data.id || docSnap.id,
            title: data.title || '',
            subtitle: data.subtitle || '',
            category: data.category || 'casal',
            date: data.date || '',
            location: data.location || '',
            src: data.src || '',
            description: data.description || '',
            isFavorite: data.isFavorite ?? false,
            aspectRatio: data.aspectRatio || 'portrait',
            quote: data.quote || '',
            order: data.order ?? photos.length,
          });
        });
        savePhotosToLocal(photos);
        onUpdate(photos);
      }
    }, (error) => {
      console.warn('Real-time photo subscription warning:', error);
    });

    return unsubscribe;
  } catch {
    return () => {};
  }
}

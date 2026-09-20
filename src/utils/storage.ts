import { PhotoItem } from '../types';
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

const DB_NAME = 'IgorAdrianaAlbumDB';
const STORE_NAME = 'photos';
const DB_VERSION = 1;
const FIRESTORE_COLLECTION = 'photos';

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
export async function savePhotosToStorage(photos: PhotoItem[]): Promise<void> {
  // Always save to IndexedDB immediately
  await savePhotosToLocal(photos);

  // Sync to Firestore
  try {
    await syncPhotosToFirestore(photos);
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
 * Helper to batch sync photos to Firestore
 */
async function syncPhotosToFirestore(photos: PhotoItem[]): Promise<void> {
  const db = getDb();
  if (!db) return;

  // Process in chunks of 500 (Firestore batch limit is 500)
  const chunkSize = 400;
  for (let i = 0; i < photos.length; i += chunkSize) {
    const chunk = photos.slice(i, i + chunkSize);
    const batch = writeBatch(db);

    chunk.forEach((photo, idx) => {
      const photoId = photo.id || `photo-${i + idx}`;
      const docRef = doc(db, FIRESTORE_COLLECTION, photoId);
      batch.set(docRef, {
        id: photoId,
        title: photo.title || 'Momento Igor e Adriana',
        subtitle: photo.subtitle || '',
        category: photo.category || 'casal',
        date: photo.date || '',
        location: photo.location || '',
        src: photo.src || '',
        description: photo.description || '',
        isFavorite: photo.isFavorite ?? false,
        aspectRatio: photo.aspectRatio || 'portrait',
        quote: photo.quote || '',
        order: photo.order ?? (i + idx),
        updatedAt: new Date().toISOString(),
      }, { merge: true });
    });

    await batch.commit();
  }
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

import React, { useState, useEffect } from 'react';
import { PhotoItem, ViewMode, FrameStyle, ClientOrder, AlbumConfig } from './types';
import { INITIAL_PHOTOS } from './data/initialPhotos';
import {
  loadPhotosFromStorage,
  savePhotosToStorage,
  saveSinglePhotoToStorage,
  deletePhotoFromStorage,
  subscribeToPhotos,
  exportAlbumBackup,
  loadStoredAlbumConfig,
  saveStoredAlbumConfig,
  DEFAULT_ALBUM_CONFIG,
} from './utils/storage';
import { loadClientsFromStorage } from './utils/clientStorage';
import { romanticAudio } from './utils/audio';
import { Header } from './components/Header';
import { PhotoCarousel } from './components/PhotoCarousel';
import { PhotoGallery } from './components/PhotoGallery';
import { FavoritesView } from './components/FavoritesView';
import { BookView } from './components/BookView';
import { ClientReportsView } from './components/ClientReportsView';
import { LightboxModal } from './components/LightboxModal';
import { PhotoUploaderModal } from './components/PhotoUploaderModal';
import { AlbumNamesModal } from './components/AlbumNamesModal';
import { MusicModal } from './components/MusicModal';
import { AmbientCanvas } from './components/AmbientCanvas';
import { Footer } from './components/Footer';

export function App() {
  const [photos, setPhotos] = useState<PhotoItem[]>(INITIAL_PHOTOS);
  const [clients, setClients] = useState<ClientOrder[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<ViewMode>('carousel');
  const [frameStyle, setFrameStyle] = useState<FrameStyle>('baroque-gold');
  const [lightboxPhoto, setLightboxPhoto] = useState<PhotoItem | null>(null);
  const [isUploaderOpen, setIsUploaderOpen] = useState<boolean>(false);
  const [uploaderMode, setUploaderMode] = useState<'replace' | 'append'>('replace');
  const [isPlayingMusic, setIsPlayingMusic] = useState<boolean>(false);
  const [isWindowDragActive, setIsWindowDragActive] = useState<boolean>(false);
  const [isSavingCloud, setIsSavingCloud] = useState<boolean>(false);
  const [config, setConfig] = useState<AlbumConfig>(loadStoredAlbumConfig);
  const [isNamesModalOpen, setIsNamesModalOpen] = useState<boolean>(false);
  const [isMusicModalOpen, setIsMusicModalOpen] = useState<boolean>(false);

  // Sync audio play status
  useEffect(() => {
    const unsub = romanticAudio.subscribe((playing) => {
      setIsPlayingMusic(playing);
    });
    return () => unsub();
  }, []);

  // Load photos and subscribe to Cloud Firestore & local cache
  useEffect(() => {
    let isMounted = true;
    async function initStorage() {
      const stored = await loadPhotosFromStorage();
      if (isMounted && stored && stored.length > 0) {
        setPhotos(stored);
      }
      const loadedClients = await loadClientsFromStorage();
      if (isMounted && loadedClients) {
        setClients(loadedClients);
      }
    }
    initStorage();

    const unsubscribe = subscribeToPhotos((updatedPhotos) => {
      if (isMounted && updatedPhotos && updatedPhotos.length > 0) {
        setPhotos(updatedPhotos);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  const handleRefreshClients = async () => {
    const list = await loadClientsFromStorage();
    setClients(list);
  };

  // Global Drag and Drop onto the window
  useEffect(() => {
    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      if (e.dataTransfer?.types.includes('Files')) {
        setIsWindowDragActive(true);
      }
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    const handleDragLeave = (e: DragEvent) => {
      if (e.clientX <= 0 || e.clientY <= 0 || e.clientX >= window.innerWidth || e.clientY >= window.innerHeight) {
        setIsWindowDragActive(false);
      }
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      setIsWindowDragActive(false);
      if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
        setUploaderMode('replace');
        setIsUploaderOpen(true);
      }
    };

    window.addEventListener('dragenter', handleDragEnter);
    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('drop', handleDrop);

    return () => {
      window.removeEventListener('dragenter', handleDragEnter);
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('drop', handleDrop);
    };
  }, []);

  // Toggle favorite
  const handleToggleFavorite = (id: string) => {
    setPhotos((prev) => {
      const updated = prev.map((p) => {
        if (p.id === id) {
          const item = { ...p, isFavorite: !p.isFavorite };
          saveSinglePhotoToStorage(item);
          return item;
        }
        return p;
      });
      return updated;
    });

    if (lightboxPhoto && lightboxPhoto.id === id) {
      setLightboxPhoto((prev) =>
        prev ? { ...prev, isFavorite: !prev.isFavorite } : null
      );
    }
  };

  // Replace all photos with new ones
  const handleReplaceAllPhotos = async (newPhotos: PhotoItem[]) => {
    setPhotos(newPhotos);
    setIsSavingCloud(true);
    try {
      await savePhotosToStorage(newPhotos);
    } finally {
      setIsSavingCloud(false);
    }
    setCurrentIndex(0);
  };

  // Replace a single photo
  const handleReplaceSinglePhoto = async (id: string, newSrc: string, newTitle?: string) => {
    let updatedItem: PhotoItem | null = null;
    setPhotos((prev) => {
      const updated = prev.map((p) => {
        if (p.id === id) {
          const item = {
            ...p,
            src: newSrc,
            title: newTitle ? newTitle : p.title,
          };
          updatedItem = item;
          return item;
        }
        return p;
      });
      return updated;
    });

    if (updatedItem) {
      setIsSavingCloud(true);
      try {
        await saveSinglePhotoToStorage(updatedItem);
      } finally {
        setIsSavingCloud(false);
      }
    }

    if (lightboxPhoto && lightboxPhoto.id === id) {
      setLightboxPhoto((prev) =>
        prev
          ? {
              ...prev,
              src: newSrc,
              title: newTitle ? newTitle : prev.title,
            }
          : null
      );
    }
  };

  // Delete a single photo
  const handleDeletePhoto = async (id: string) => {
    setPhotos((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      return updated;
    });
    setIsSavingCloud(true);
    try {
      await deletePhotoFromStorage(id);
    } finally {
      setIsSavingCloud(false);
    }
    setCurrentIndex((prev) => Math.max(0, Math.min(prev, photos.length - 2)));
    if (lightboxPhoto && lightboxPhoto.id === id) {
      setLightboxPhoto(null);
    }
  };

  // Add new photos via uploader
  const handleAddPhotos = async (newPhotos: PhotoItem[]) => {
    const updated = [...newPhotos, ...photos];
    setPhotos(updated);
    setIsSavingCloud(true);
    try {
      await savePhotosToStorage(updated);
    } finally {
      setIsSavingCloud(false);
    }
    setCurrentIndex(0);
  };

  // Reset to initial photos / models
  const handleResetPhotos = async () => {
    setPhotos(INITIAL_PHOTOS);
    setIsSavingCloud(true);
    try {
      await savePhotosToStorage(INITIAL_PHOTOS);
    } finally {
      setIsSavingCloud(false);
    }
    setCurrentIndex(0);
  };

  // Audio toggle
  const handleToggleMusic = () => {
    const status = romanticAudio.toggle();
    setIsPlayingMusic(status);
  };

  const handleOpenUploader = (mode: 'replace' | 'append' = 'replace') => {
    setUploaderMode(mode);
    setIsUploaderOpen(true);
  };

  const handleSaveConfig = (newConfig: AlbumConfig) => {
    setConfig(newConfig);
    saveStoredAlbumConfig(newConfig);
  };

  return (
    <div className="relative min-h-screen bg-[#070709] text-[#f2ede4] flex flex-col justify-between overflow-x-hidden">
      {/* Background Animated Starlight / Golden Dust Particles */}
      <AmbientCanvas />

      {/* Full-Window Drag Drop Overlay Prompt */}
      {isWindowDragActive && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 border-4 border-dashed border-[#d4af37] animate-pulse">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-serif-display text-[#ffd97d] mb-3">
              Solte as Fotos Aqui
            </h2>
            <p className="font-cormorant text-lg text-[#ebd29b]">
              Substitua instantaneamente o álbum Studio IA pelas suas novas imagens
            </p>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div className="relative z-10 w-full flex flex-col flex-1">
        {/* Header with Title Studio IA in elegant typography */}
        <Header
          viewMode={viewMode}
          onChangeViewMode={setViewMode}
          isPlayingMusic={isPlayingMusic}
          onToggleMusic={handleToggleMusic}
          onOpenMusicModal={() => setIsMusicModalOpen(true)}
          onOpenUploader={handleOpenUploader}
          photosCount={photos.length}
          favoritesCount={photos.filter((p) => p.isFavorite).length}
          config={config}
          onOpenNamesModal={() => setIsNamesModalOpen(true)}
          onExportBackup={() => exportAlbumBackup(photos)}
          isSavingCloud={isSavingCloud}
        />

        {/* Dynamic Views */}
        <main className="w-full flex-1 flex flex-col items-center justify-center mt-2">
          {viewMode === 'carousel' && (
            <PhotoCarousel
              photos={photos}
              currentIndex={currentIndex}
              onSelectIndex={setCurrentIndex}
              frameStyle={frameStyle}
              onChangeFrameStyle={setFrameStyle}
              onToggleFavorite={handleToggleFavorite}
              onOpenLightbox={setLightboxPhoto}
              onReplaceSinglePhoto={handleReplaceSinglePhoto}
              onDeletePhoto={handleDeletePhoto}
              onOpenUploader={handleOpenUploader}
            />
          )}

          {viewMode === 'gallery' && (
            <PhotoGallery
              photos={photos}
              frameStyle={frameStyle}
              onChangeFrameStyle={setFrameStyle}
              onSelectPhoto={(idx) => {
                setCurrentIndex(idx);
                setViewMode('carousel');
              }}
              onToggleFavorite={handleToggleFavorite}
              onOpenLightbox={setLightboxPhoto}
              onReplaceSinglePhoto={handleReplaceSinglePhoto}
              onOpenUploader={handleOpenUploader}
              config={config}
            />
          )}

          {viewMode === 'favorites' && (
            <FavoritesView
              photos={photos}
              frameStyle={frameStyle}
              onSelectPhoto={(idx) => {
                setCurrentIndex(idx);
                setViewMode('carousel');
              }}
              onToggleFavorite={handleToggleFavorite}
              onOpenLightbox={setLightboxPhoto}
              onGoToGallery={() => setViewMode('gallery')}
              onGoToBook={() => setViewMode('book')}
              config={config}
            />
          )}

          {viewMode === 'book' && (
            <BookView
              photos={photos}
              frameStyle={frameStyle}
              onOpenLightbox={setLightboxPhoto}
              config={config}
            />
          )}

          {viewMode === 'reports' && (
            <ClientReportsView
              clients={clients}
              onRefreshClients={handleRefreshClients}
              isSavingCloud={isSavingCloud}
            />
          )}
        </main>

        {/* Footer */}
        <Footer config={config} />
      </div>

      {/* Fullscreen Lightbox Modal */}
      <LightboxModal
        photo={lightboxPhoto}
        photos={photos}
        frameStyle={frameStyle}
        onClose={() => setLightboxPhoto(null)}
        onSelectPhoto={setLightboxPhoto}
        onToggleFavorite={handleToggleFavorite}
        onReplaceSinglePhoto={handleReplaceSinglePhoto}
      />

      {/* Drag & Drop Photo Uploader Modal */}
      <PhotoUploaderModal
        isOpen={isUploaderOpen}
        onClose={() => setIsUploaderOpen(false)}
        onReplaceAllPhotos={handleReplaceAllPhotos}
        onAddPhotos={handleAddPhotos}
        onResetPhotos={handleResetPhotos}
        currentCount={photos.length}
        initialMode={uploaderMode}
      />

      {/* Album Names (Couple & Model) Customization Modal */}
      <AlbumNamesModal
        isOpen={isNamesModalOpen}
        onClose={() => setIsNamesModalOpen(false)}
        config={config}
        onSaveConfig={handleSaveConfig}
      />

      {/* Custom Music & Soundtrack Modal */}
      <MusicModal
        isOpen={isMusicModalOpen}
        onClose={() => setIsMusicModalOpen(false)}
        isPlaying={isPlayingMusic}
        onTogglePlay={handleToggleMusic}
      />
    </div>
  );
}

export default App;

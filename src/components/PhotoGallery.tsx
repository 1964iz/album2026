import React, { useState, useRef, useEffect } from 'react';
import { PhotoItem, Category, FrameStyle, AlbumConfig } from '../types';
import { ClassicalFrame } from './ClassicalFrame';
import { Heart, Maximize2, Eye, Filter, Replace, Upload } from 'lucide-react';
import { compressImageFile } from '../utils/imageCompressor';

interface PhotoGalleryProps {
  photos: PhotoItem[];
  frameStyle: FrameStyle;
  onChangeFrameStyle?: (style: FrameStyle) => void;
  onSelectPhoto: (index: number) => void;
  onToggleFavorite: (id: string) => void;
  onOpenLightbox: (photo: PhotoItem) => void;
  onReplaceSinglePhoto?: (id: string, newSrc: string, newTitle?: string) => void;
  onOpenUploader?: (mode?: 'replace' | 'append') => void;
  config?: AlbumConfig;
  initialFavoritesOnly?: boolean;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  photos,
  frameStyle,
  onChangeFrameStyle,
  onSelectPhoto,
  onToggleFavorite,
  onOpenLightbox,
  onReplaceSinglePhoto,
  onOpenUploader,
  config,
  initialFavoritesOnly = false,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<Category>('todos');
  const [showOnlyFavorites, setShowOnlyFavorites] = useState(initialFavoritesOnly);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [targetPhotoId, setTargetPhotoId] = useState<string | null>(null);

  useEffect(() => {
    setShowOnlyFavorites(initialFavoritesOnly);
  }, [initialFavoritesOnly]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !targetPhotoId || !onReplaceSinglePhoto) return;

    const dataUrl = await compressImageFile(file);
    if (!dataUrl) return;

    const cleanTitle = file.name
      .replace(/\.[^/.]+$/, '')
      .replace(/[-_]/g, ' ')
      .trim();

    onReplaceSinglePhoto(targetPhotoId, dataUrl, cleanTitle);
    e.target.value = '';
    setTargetPhotoId(null);
  };

  const triggerReplacePhoto = (photoId: string) => {
    setTargetPhotoId(photoId);
    fileInputRef.current?.click();
  };

  const filteredPhotos = photos.filter((p) => {
    if (showOnlyFavorites && !p.isFavorite) return false;
    if (selectedCategory === 'todos') return true;
    return p.category === selectedCategory;
  });

  const categories: { id: Category; label: string }[] = [
    { id: 'todos', label: 'Todos os Momentos' },
    { id: 'casal', label: config?.coupleName ? `Casal (${config.coupleName})` : 'Casal' },
    { id: 'modelo', label: config?.modelName ? `Modelo (${config.modelName})` : 'Ensaios & Modelos' },
    { id: 'especial', label: 'Momentos Especiais' },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Filters & Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-[#2a241b]">
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 sm:pb-0">
          <Filter className="w-4 h-4 text-[#c5a059] mr-1 shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat.id}
              id={`filter-${cat.id}`}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-cinzel transition-all shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-gradient-to-r from-[#d4af37] to-[#aa7a2c] text-[#120f0a] font-bold shadow-[0_0_12px_rgba(212,175,55,0.3)]'
                  : 'bg-[#141316] text-[#a69680] border border-[#382f20]/50 hover:border-[#c5a059]/60 hover:text-[#ebd29b]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Favorite filter toggle, Frame style switcher & Replace album button */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Direct Borda Prateada / Dourada Switcher */}
          {onChangeFrameStyle && (
            <div className="flex items-center bg-[#141316] p-0.5 rounded-full border border-[#382f20]/60">
              <button
                id="gallery-silver-border-btn"
                onClick={() => onChangeFrameStyle('imperial-silver')}
                className={`px-2.5 py-1 text-[11px] font-cinzel rounded-full transition-all cursor-pointer ${
                  frameStyle === 'imperial-silver'
                    ? 'bg-gradient-to-r from-[#cfd8dc] to-[#78909c] text-[#0f1214] font-bold shadow-[0_0_10px_rgba(207,216,220,0.5)]'
                    : 'text-[#9b8d78] hover:text-[#cfd8dc]'
                }`}
                title="Aplicar Borda Prateada em todas as imagens"
              >
                Borda Prateada
              </button>
              <button
                id="gallery-gold-border-btn"
                onClick={() => onChangeFrameStyle('baroque-gold')}
                className={`px-2.5 py-1 text-[11px] font-cinzel rounded-full transition-all cursor-pointer ${
                  frameStyle === 'baroque-gold'
                    ? 'bg-gradient-to-r from-[#d4af37] to-[#aa7a2c] text-[#120f0a] font-bold shadow-[0_0_10px_rgba(212,175,55,0.4)]'
                    : 'text-[#9b8d78] hover:text-[#ebd29b]'
                }`}
                title="Aplicar Borda Dourada Barroca em todas as imagens"
              >
                Borda Dourada
              </button>
            </div>
          )}

          {onOpenUploader && (
            <button
              id="gallery-substitute-btn"
              onClick={() => onOpenUploader('replace')}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-cinzel bg-[#201c15] border border-[#d4af37]/40 text-[#ffd97d] hover:bg-[#342918] transition-all cursor-pointer"
              title="Substituir todas as fotos do álbum pelas suas próprias imagens"
            >
              <Replace className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Substituir Fotos</span>
            </button>
          )}

          <button
            id="filter-favorites-btn"
            onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-cinzel border transition-all cursor-pointer ${
              showOnlyFavorites
                ? 'bg-[#e74c3c]/20 text-[#ff7675] border-[#e74c3c]'
                : 'bg-[#141316] text-[#a69680] border-[#382f20]/50 hover:border-[#c5a059]/60'
            }`}
          >
            <Heart
              className={`w-3.5 h-3.5 ${
                showOnlyFavorites ? 'fill-[#e74c3c] text-[#e74c3c]' : 'text-[#a69680]'
              }`}
            />
            <span>Apenas Favoritos</span>
          </button>
        </div>
      </div>

      {/* Hidden file input for single photo replacement in gallery */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Gallery Grid */}
      {filteredPhotos.length === 0 ? (
        <div className="text-center py-24 text-[#8a7f70] font-cormorant text-xl">
          Nenhuma foto encontrada para os filtros selecionados.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {filteredPhotos.map((photo) => {
            const originalIndex = photos.findIndex((p) => p.id === photo.id);
            return (
              <div key={photo.id} className="flex flex-col">
                <ClassicalFrame
                  frameStyle={frameStyle}
                  enableTilt={true}
                  enableHoverZoom={true}
                  caption={photo.title}
                  subcaption={photo.location}
                  showPlaque={true}
                  className="w-full"
                  onClick={() => onSelectPhoto(originalIndex)}
                >
                  <div className="relative w-full aspect-[4/5] bg-black overflow-hidden group">
                    <img
                      src={photo.src}
                      alt={photo.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center transition-all duration-700 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Hover Quick Overlay Buttons */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3 pointer-events-none">
                      <div className="flex justify-end space-x-1.5 pointer-events-auto">
                        {onReplaceSinglePhoto && (
                          <button
                            id={`replace-grid-${photo.id}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              triggerReplacePhoto(photo.id);
                            }}
                            className="p-2 rounded-full bg-black/75 border border-[#d4af37]/40 text-[#ffd97d] hover:bg-[#c5a059] hover:text-black transition-colors"
                            title="Trocar imagem desta foto do seu dispositivo"
                          >
                            <Upload className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          id={`fav-grid-${photo.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(photo.id);
                          }}
                          className="p-2 rounded-full bg-black/70 border border-[#c5a059]/40 text-white hover:scale-110 transition-transform"
                          title="Favoritar"
                        >
                          <Heart
                            className={`w-3.5 h-3.5 ${
                              photo.isFavorite ? 'fill-[#e74c3c] text-[#e74c3c]' : 'text-white'
                            }`}
                          />
                        </button>
                        <button
                          id={`zoom-grid-${photo.id}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onOpenLightbox(photo);
                          }}
                          className="p-2 rounded-full bg-black/70 border border-[#c5a059]/40 text-white hover:scale-110 transition-transform"
                          title="Visualizar em Tela Cheia"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-center pointer-events-auto">
                        <button
                          onClick={() => onSelectPhoto(originalIndex)}
                          className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-[#c5a059] text-[#120f09] text-[11px] font-cinzel font-bold shadow-lg hover:bg-[#dfba73] transition-colors"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Ver no Carrossel</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </ClassicalFrame>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

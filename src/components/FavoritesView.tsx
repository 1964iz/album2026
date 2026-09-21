import React, { useState } from 'react';
import { PhotoItem, FrameStyle, AlbumConfig } from '../types';
import { ClassicalFrame } from './ClassicalFrame';
import {
  Heart,
  Maximize2,
  Eye,
  Sparkles,
  ArrowRight,
  ImageIcon,
  BookOpen,
} from 'lucide-react';

interface FavoritesViewProps {
  photos: PhotoItem[];
  frameStyle: FrameStyle;
  onSelectPhoto: (index: number) => void;
  onToggleFavorite: (id: string) => void;
  onOpenLightbox: (photo: PhotoItem) => void;
  onGoToGallery: () => void;
  onGoToBook: () => void;
  config?: AlbumConfig;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  photos,
  frameStyle,
  onSelectPhoto,
  onToggleFavorite,
  onOpenLightbox,
  onGoToGallery,
  onGoToBook,
  config,
}) => {
  const favoritePhotos = photos.filter((p) => p.isFavorite);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="w-full mb-8 p-6 rounded-2xl bg-gradient-to-r from-[#1b1214] via-[#201518] to-[#171214] border border-[#e74c3c]/30 shadow-[0_10px_35px_rgba(0,0,0,0.8)] text-center relative overflow-hidden">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#e74c3c]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="inline-flex p-3 rounded-full bg-[#2c1518] border border-[#e74c3c]/40 text-[#ff7675] mb-3 shadow-[0_0_20px_rgba(231,76,60,0.3)]">
          <Heart className="w-7 h-7 fill-[#e74c3c] text-[#e74c3c]" />
        </div>

        <h2 className="font-serif-display text-3xl sm:text-4xl text-gold-gradient font-bold mb-2">
          Fotos Favoritas do Álbum
        </h2>

        <p className="font-cormorant italic text-base sm:text-lg text-[#d9c7b8] max-w-xl mx-auto">
          {config?.coupleName ? `As memórias mais preciosas de ${config.coupleName}` : 'Sua seleção exclusiva de momentos mais marcantes e inesquecíveis'}
        </p>

        <div className="mt-3 flex items-center justify-center space-x-3">
          <span className="px-3 py-1 rounded-full text-xs font-cinzel bg-black/60 border border-[#e74c3c]/40 text-[#ff9f43]">
            {favoritePhotos.length} {favoritePhotos.length === 1 ? 'Foto Favorita' : 'Fotos Favoritas'}
          </span>

          {favoritePhotos.length > 0 && (
            <button
              onClick={onGoToBook}
              className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-cinzel bg-[#251e18] border border-[#d4af37]/40 text-[#ffd97d] hover:bg-[#342b1f] cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Ver Álbum Livro</span>
            </button>
          )}
        </div>
      </div>

      {/* Empty State */}
      {favoritePhotos.length === 0 ? (
        <div className="w-full max-w-xl mx-auto p-8 rounded-2xl bg-[#141217] border border-[#382f20] text-center my-10 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-[#20181b] border border-[#e74c3c]/30 flex items-center justify-center text-[#ff7675] mb-4">
            <Heart className="w-8 h-8" />
          </div>

          <h3 className="font-serif-display text-xl text-[#f7e8bc] font-bold mb-2">
            Nenhuma foto marcada como favorita ainda
          </h3>

          <p className="text-sm font-cormorant text-[#a89b88] max-w-md mb-6 leading-relaxed">
            Você pode marcar qualquer foto com um coração no Carrossel ou na Galeria para reuni-las nesta coleção especial.
          </p>

          <button
            onClick={onGoToGallery}
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#d4af37] via-[#ffd97d] to-[#aa7a2c] text-[#0f0e09] font-cinzel text-xs font-bold shadow-lg hover:brightness-110 flex items-center space-x-2 cursor-pointer"
          >
            <ImageIcon className="w-4 h-4" />
            <span>Explorar Galeria e Marcar Favoritas</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </button>
        </div>
      ) : (
        /* Favorites Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoritePhotos.map((photo) => {
            const originalIndex = photos.findIndex((p) => p.id === photo.id);
            return (
              <div
                key={photo.id}
                className="group relative flex flex-col bg-[#121115] rounded-xl overflow-hidden border border-[#3b2a2a] hover:border-[#e74c3c]/80 transition-all duration-300 shadow-[0_8px_25px_rgba(0,0,0,0.6)] hover:shadow-[0_12px_35px_rgba(231,76,60,0.25)]"
              >
                {/* Frame & Image Container */}
                <ClassicalFrame frameStyle={frameStyle} className="w-full">
                  <div className="relative w-full aspect-[4/5] overflow-hidden bg-black flex items-center justify-center">
                    <img
                      src={photo.src}
                      alt={photo.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center transition-all duration-700 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Quick Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3 pointer-events-none">
                      <div className="flex justify-end pointer-events-auto">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleFavorite(photo.id);
                          }}
                          className="p-2 rounded-full bg-black/80 border border-[#e74c3c]/70 text-[#ff7675] hover:bg-[#e74c3c] hover:text-white transition-colors cursor-pointer"
                          title="Remover das favoritas"
                        >
                          <Heart className="w-4 h-4 fill-[#e74c3c]" />
                        </button>
                      </div>

                      <div className="flex items-center justify-center space-x-2 pointer-events-auto">
                        <button
                          onClick={() => onSelectPhoto(originalIndex >= 0 ? originalIndex : 0)}
                          className="px-3 py-1.5 rounded-full bg-black/80 border border-[#d4af37]/60 text-[#ffd97d] text-xs font-cinzel hover:bg-[#d4af37] hover:text-black transition-colors flex items-center space-x-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Ver no Carrossel</span>
                        </button>

                        <button
                          onClick={() => onOpenLightbox(photo)}
                          className="p-2 rounded-full bg-black/80 border border-[#d4af37]/60 text-[#ffd97d] hover:bg-[#d4af37] hover:text-black transition-colors cursor-pointer"
                          title="Ampliar foto"
                        >
                          <Maximize2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </ClassicalFrame>

                {/* Caption Bar */}
                <div className="p-3.5 bg-gradient-to-b from-[#181416] to-[#100e12] border-t border-[#3b2a2a] flex flex-col justify-between flex-1">
                  <div>
                    <h4 className="font-cinzel text-sm font-semibold text-[#f7e8bc] line-clamp-1 group-hover:text-gold-gradient transition-colors">
                      {photo.title}
                    </h4>
                    <p className="font-cormorant italic text-xs text-[#b8a998] line-clamp-1 mt-0.5">
                      {photo.subtitle || photo.location}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#291f21] text-[11px] font-cinzel text-[#8e816f]">
                    <span>{photo.date}</span>
                    <span className="flex items-center space-x-1 text-[#ff7675]">
                      <Heart className="w-3 h-3 fill-current" />
                      <span>Favorita</span>
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

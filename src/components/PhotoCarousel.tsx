import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Maximize2,
  Heart,
  Calendar,
  MapPin,
  Sparkles,
  Quote,
  Layers,
  Replace,
  Upload,
  Trash2,
} from 'lucide-react';
import { PhotoItem, FrameStyle } from '../types';
import { ClassicalFrame } from './ClassicalFrame';

interface PhotoCarouselProps {
  photos: PhotoItem[];
  currentIndex: number;
  onSelectIndex: (index: number) => void;
  frameStyle: FrameStyle;
  onChangeFrameStyle: (style: FrameStyle) => void;
  onToggleFavorite: (id: string) => void;
  onOpenLightbox: (photo: PhotoItem) => void;
  onReplaceSinglePhoto?: (id: string, newSrc: string, newTitle?: string) => void;
  onDeletePhoto?: (id: string) => void;
  onOpenUploader?: (mode?: 'replace' | 'append') => void;
}

export const PhotoCarousel: React.FC<PhotoCarouselProps> = ({
  photos,
  currentIndex,
  onSelectIndex,
  frameStyle,
  onChangeFrameStyle,
  onToggleFavorite,
  onOpenLightbox,
  onReplaceSinglePhoto,
  onDeletePhoto,
  onOpenUploader,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [slideInterval, setSlideInterval] = useState<number>(5000);
  const [progress, setProgress] = useState<number>(0);
  const progressRef = useRef<number | null>(null);
  const thumbnailsRef = useRef<HTMLDivElement>(null);
  const singleFileInputRef = useRef<HTMLInputElement>(null);

  const currentPhoto = photos[currentIndex] || photos[0];

  const handleSingleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentPhoto || !onReplaceSinglePhoto) return;

    const dataUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });

    const cleanTitle = file.name
      .replace(/\.[^/.]+$/, '')
      .replace(/[-_]/g, ' ')
      .trim();

    onReplaceSinglePhoto(currentPhoto.id, dataUrl, cleanTitle);
    e.target.value = '';
  };

  const handleNext = useCallback(() => {
    if (photos.length === 0) return;
    onSelectIndex((currentIndex + 1) % photos.length);
    setProgress(0);
  }, [currentIndex, photos.length, onSelectIndex]);

  const handlePrev = useCallback(() => {
    if (photos.length === 0) return;
    onSelectIndex((currentIndex - 1 + photos.length) % photos.length);
    setProgress(0);
  }, [currentIndex, photos.length, onSelectIndex]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === ' ') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  // Slideshow timer
  useEffect(() => {
    if (!isPlaying) {
      setProgress(0);
      return;
    }

    const start = Date.now();
    const interval = window.setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min((elapsed / slideInterval) * 100, 100);
      setProgress(pct);

      if (elapsed >= slideInterval) {
        handleNext();
      }
    }, 50);

    progressRef.current = interval;

    return () => {
      clearInterval(interval);
    };
  }, [isPlaying, currentIndex, slideInterval, handleNext]);

  // Scroll active thumbnail into center view
  useEffect(() => {
    if (thumbnailsRef.current) {
      const activeEl = thumbnailsRef.current.children[currentIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest',
        });
      }
    }
  }, [currentIndex]);

  if (!currentPhoto) {
    return <div className="text-center py-20 text-[#a39a8c]">Nenhuma foto no álbum.</div>;
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 flex flex-col items-center">
      {/* Quick Prompt Banner to Replace Photos */}
      <div className="w-full mb-4 p-2.5 sm:p-3 rounded-lg bg-gradient-to-r from-[#181510] via-[#221c13] to-[#181510] border border-[#d4af37]/30 flex flex-wrap items-center justify-between gap-2 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-[#ffd97d] shrink-0 animate-pulse" />
          <p className="text-xs sm:text-sm text-[#e6dbce] font-cormorant">
            <strong className="text-[#ffd97d] font-cinzel font-semibold">Personalize o Álbum:</strong> Insira as fotos reais de Igor e Adriana substituindo as já presentes.
          </p>
        </div>
        <button
          id="banner-substitute-btn"
          onClick={() => onOpenUploader && onOpenUploader('replace')}
          className="flex items-center space-x-1 px-3 py-1 rounded-full bg-gradient-to-r from-[#d4af37] to-[#aa7a2c] text-[#120f0a] font-cinzel text-xs font-bold hover:brightness-110 transition-all shadow-md ml-auto cursor-pointer"
        >
          <Replace className="w-3.5 h-3.5" />
          <span>Substituir Fotos Agora</span>
        </button>
      </div>

      {/* Top Carousel Bar: Counter, Frame Selector, Slideshow Controls */}
      <div className="w-full flex flex-wrap items-center justify-between gap-3 mb-6 pb-3 border-b border-[#2a241b]/80">
        
        {/* Photo Counter */}
        <div className="flex items-center space-x-2">
          <span className="font-cinzel text-xs tracking-widest text-[#d4af37] font-semibold">
            MEMÓRIA {String(currentIndex + 1).padStart(2, '0')}
          </span>
          <span className="text-[#685c49]">/</span>
          <span className="text-xs text-[#a19685] font-cinzel">
            {String(photos.length).padStart(2, '0')}
          </span>
        </div>

        {/* Frame Style Quick Switcher */}
        <div className="flex items-center space-x-1 sm:space-x-2 bg-[#121114]/90 p-1 rounded-full border border-[#382f20]/60">
          <Layers className="w-3.5 h-3.5 text-[#c5a059] ml-2 hidden sm:inline" />
          <span className="text-[11px] text-[#a69680] font-cinzel mr-1 hidden sm:inline">Moldura:</span>
          
          <button
            id="frame-baroque-btn"
            onClick={() => onChangeFrameStyle('baroque-gold')}
            className={`px-2.5 py-1 text-[11px] font-cinzel rounded-full transition-all ${
              frameStyle === 'baroque-gold'
                ? 'bg-gradient-to-r from-[#d4af37] to-[#aa7a2c] text-[#120f0a] font-bold shadow-[0_0_12px_rgba(212,175,55,0.4)]'
                : 'text-[#9b8d78] hover:text-[#ebd29b]'
            }`}
          >
            Barroco Ouro
          </button>
          <button
            id="frame-rococo-btn"
            onClick={() => onChangeFrameStyle('rococo-filigree')}
            className={`px-2.5 py-1 text-[11px] font-cinzel rounded-full transition-all ${
              frameStyle === 'rococo-filigree'
                ? 'bg-gradient-to-r from-[#e5b974] to-[#ad782b] text-[#120f0a] font-bold shadow-[0_0_12px_rgba(229,185,116,0.4)]'
                : 'text-[#9b8d78] hover:text-[#ebd29b]'
            }`}
          >
            Rococó Real
          </button>
          <button
            id="frame-silver-btn"
            onClick={() => onChangeFrameStyle('imperial-silver')}
            className={`px-2.5 py-1 text-[11px] font-cinzel rounded-full transition-all ${
              frameStyle === 'imperial-silver'
                ? 'bg-gradient-to-r from-[#cfd8dc] to-[#78909c] text-[#0f1214] font-bold shadow-[0_0_12px_rgba(207,216,220,0.4)]'
                : 'text-[#9b8d78] hover:text-[#cfd8dc]'
            }`}
          >
            Imperial Prata
          </button>
          <button
            id="frame-minimal-btn"
            onClick={() => onChangeFrameStyle('minimal-brass')}
            className={`px-2.5 py-1 text-[11px] font-cinzel rounded-full transition-all ${
              frameStyle === 'minimal-brass'
                ? 'bg-gradient-to-r from-[#bf9b56] to-[#735722] text-[#120f0a] font-bold'
                : 'text-[#9b8d78] hover:text-[#ebd29b]'
            }`}
          >
            Nobre Fino
          </button>
        </div>

        {/* Slideshow & Fullscreen controls */}
        <div className="flex items-center space-x-2">
          <button
            id="slideshow-toggle-btn"
            onClick={() => setIsPlaying(!isPlaying)}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-cinzel border transition-all ${
              isPlaying
                ? 'bg-[#c5a059]/20 text-[#fce9b8] border-[#c5a059]'
                : 'bg-[#151418] text-[#a69680] border-[#382f20]/60 hover:border-[#c5a059]/60 hover:text-[#ebd29b]'
            }`}
            title={isPlaying ? 'Pausar Slideshow' : 'Iniciar Slideshow'}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 text-[#fce9b8]" />
                <span className="hidden sm:inline">Pausar</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 text-[#c5a059]" />
                <span className="hidden sm:inline">Apresentação</span>
              </>
            )}
          </button>

          {/* Speed selector when playing */}
          {isPlaying && (
            <select
              value={slideInterval}
              onChange={(e) => setSlideInterval(Number(e.target.value))}
              className="bg-[#151418] border border-[#382f20] text-[#c5a059] text-[11px] font-cinzel rounded-md px-1.5 py-1 focus:outline-none"
            >
              <option value={3000}>3s</option>
              <option value={5000}>5s</option>
              <option value={8000}>8s</option>
            </select>
          )}

          <button
            id="inspect-modal-btn"
            onClick={() => onOpenLightbox(currentPhoto)}
            className="p-1.5 rounded-full bg-[#151418] border border-[#382f20]/60 text-[#a69680] hover:text-[#fce9b8] hover:border-[#c5a059]/60 transition-all"
            title="Expandir Foto em Alta Definição"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Progress Bar for Slideshow */}
      {isPlaying && (
        <div className="w-full h-1 bg-[#1a1815] rounded-full overflow-hidden mb-5 -mt-3">
          <div
            className="h-full bg-gradient-to-r from-[#aa7a2c] via-[#ffd97d] to-[#d4af37] transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}

      {/* Spotlight Showcase Area with Grand Ornamental Frame */}
      <div className="relative w-full flex items-center justify-center my-2 sm:my-4">
        
        {/* Previous Navigation Button */}
        <button
          id="carousel-prev-btn"
          onClick={handlePrev}
          aria-label="Foto Anterior"
          className="absolute left-0 sm:-left-6 lg:-left-12 z-30 p-2.5 sm:p-3.5 rounded-full bg-[#14120f]/90 border border-[#d4af37]/40 text-[#ebd29b] hover:bg-[#252018] hover:text-white hover:border-[#ffd97d] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all transform hover:-translate-x-1"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Center Framed Art Canvas */}
        <div className="w-full max-w-2xl px-8 sm:px-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPhoto.id}
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: -8 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="flex flex-col items-center"
            >
              <ClassicalFrame
                frameStyle={frameStyle}
                enableTilt={true}
                enableHoverZoom={true}
                caption={currentPhoto.title}
                subcaption={currentPhoto.subtitle}
                showPlaque={true}
                onClick={() => onOpenLightbox(currentPhoto)}
                className="w-full max-w-lg"
              >
                <div className="relative w-full aspect-[4/5] sm:aspect-[3/4] overflow-hidden bg-black flex items-center justify-center">
                  <img
                    src={currentPhoto.src}
                    alt={currentPhoto.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center transition-all duration-700"
                    loading="eager"
                  />

                  {/* Corner Heart Favorite Toggle */}
                  <button
                    id={`fav-btn-${currentPhoto.id}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(currentPhoto.id);
                    }}
                    className="absolute top-3 right-3 z-30 p-2 rounded-full bg-black/60 backdrop-blur-md border border-[#c5a059]/40 text-[#f5dfa8] hover:bg-black/90 hover:scale-110 transition-all drop-shadow-md"
                    title={currentPhoto.isFavorite ? 'Remover dos Favoritos' : 'Salvar como Favorita'}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        currentPhoto.isFavorite
                          ? 'fill-[#e74c3c] text-[#e74c3c]'
                          : 'text-[#f5dfa8]'
                      }`}
                    />
                  </button>

                  {/* Interactive Hover Inspection Hint */}
                  <div className="absolute bottom-2 left-2 z-30 px-2.5 py-1 rounded-full bg-black/65 backdrop-blur-md border border-[#c5a059]/30 text-[10px] text-[#f7e6b5] font-cinzel opacity-0 group-hover:opacity-100 transition-opacity flex items-center space-x-1 pointer-events-none">
                    <Sparkles className="w-3 h-3 text-[#d4af37]" />
                    <span>Passe o cursor para ampliar • Clique para tela cheia</span>
                  </div>
                </div>
              </ClassicalFrame>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Next Navigation Button */}
        <button
          id="carousel-next-btn"
          onClick={handleNext}
          aria-label="Próxima Foto"
          className="absolute right-0 sm:-right-6 lg:-right-12 z-30 p-2.5 sm:p-3.5 rounded-full bg-[#14120f]/90 border border-[#d4af37]/40 text-[#ebd29b] hover:bg-[#252018] hover:text-white hover:border-[#ffd97d] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all transform hover:translate-x-1"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Memory Details & Romantic Narrative Box */}
      <div className="w-full max-w-2xl mt-6 p-4 sm:p-6 rounded-md bg-gradient-to-b from-[#111013] to-[#0a0a0c] border border-[#2e261a]/80 shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#a89781] mb-2 pb-2 border-b border-[#231e16]">
          <div className="flex items-center space-x-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#c5a059]" />
            <span className="font-cormorant text-sm">{currentPhoto.date}</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <MapPin className="w-3.5 h-3.5 text-[#c5a059]" />
            <span className="font-cormorant text-sm">{currentPhoto.location}</span>
          </div>
        </div>

        <p className="font-cormorant text-base sm:text-lg text-[#ded3c3] leading-relaxed tracking-wide">
          {currentPhoto.description}
        </p>

        {currentPhoto.quote && (
          <div className="mt-3 pt-3 border-t border-[#231e16] flex items-start space-x-2">
            <Quote className="w-4 h-4 text-[#d4af37] shrink-0 mt-0.5" />
            <p className="font-cormorant italic text-sm sm:text-base text-[#f5dfa8]/90">
              "{currentPhoto.quote}"
            </p>
          </div>
        )}

        {/* Photo Actions Toolbar: Replace this photo, Replace all photos, Delete */}
        <div className="mt-4 pt-3 border-t border-[#231e16] flex flex-wrap items-center justify-between gap-2">
          <input
            ref={singleFileInputRef}
            type="file"
            accept="image/*"
            onChange={handleSingleFileChange}
            className="hidden"
          />

          <button
            id={`replace-single-btn-${currentPhoto.id}`}
            onClick={() => singleFileInputRef.current?.click()}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#1b1915] border border-[#d4af37]/40 text-[#f5dfa8] hover:bg-[#2b251a] hover:border-[#ffd97d] text-xs font-cinzel transition-all cursor-pointer"
            title="Substituir apenas esta foto selecionando uma imagem do seu computador"
          >
            <Upload className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Trocar Imagem Desta Foto</span>
          </button>

          {onOpenUploader && (
            <button
              onClick={() => onOpenUploader('replace')}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-[#201c15] border border-[#c5a059]/40 text-[#ffd97d] hover:bg-[#342918] text-xs font-cinzel transition-all cursor-pointer"
              title="Inserir imagens substituindo todas as já presentes"
            >
              <Replace className="w-3.5 h-3.5" />
              <span>Substituir Todas as Fotos</span>
            </button>
          )}

          {onDeletePhoto && photos.length > 1 && (
            <button
              onClick={() => {
                if (confirm(`Deseja remover "${currentPhoto.title}" do álbum?`)) {
                  onDeletePhoto(currentPhoto.id);
                }
              }}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded text-xs font-cinzel text-[#886969] hover:text-[#ff7675] hover:bg-[#2b1616]/40 transition-colors ml-auto cursor-pointer"
              title="Excluir esta foto do álbum"
            >
              <Trash2 className="w-3 h-3" />
              <span className="hidden sm:inline">Remover Foto</span>
            </button>
          )}
        </div>
      </div>

      {/* Thumbnails Ribbon / Filmstrip Below */}
      <div className="w-full mt-8 pt-4 border-t border-[#241e15]">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="font-cinzel text-xs tracking-widest text-[#a89781] uppercase">
            Índice de Retratos & Momentos
          </span>
          <span className="text-[11px] text-[#6d6150] font-cinzel">
            Clique na miniatura para navegar
          </span>
        </div>

        <div
          ref={thumbnailsRef}
          className="flex space-x-3 overflow-x-auto py-2 px-1 scroll-smooth no-scrollbar"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {photos.map((photo, idx) => {
            const isActive = idx === currentIndex;
            return (
              <button
                key={photo.id}
                id={`thumb-${photo.id}`}
                onClick={() => {
                  onSelectIndex(idx);
                  setProgress(0);
                }}
                className={`relative shrink-0 w-16 h-20 sm:w-20 sm:h-24 rounded-sm overflow-hidden transition-all duration-300 transform ${
                  isActive
                    ? 'scale-105 ring-2 ring-[#d4af37] shadow-[0_0_16px_rgba(212,175,55,0.6)] z-10'
                    : 'opacity-50 hover:opacity-90 hover:scale-100 ring-1 ring-[#3a3020]'
                }`}
              >
                <img
                  src={photo.src}
                  alt={photo.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {isActive && (
                  <div className="absolute inset-0 border border-[#fce9b8]/80 pointer-events-none" />
                )}
                {photo.isFavorite && (
                  <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#e74c3c]" />
                )}
                <div className="absolute bottom-0 inset-x-0 bg-black/70 text-[9px] text-[#ebd29b] font-cinzel py-0.5 text-center">
                  {String(idx + 1).padStart(2, '0')}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

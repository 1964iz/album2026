import React, { useState, useEffect } from 'react';
import { PhotoItem, FrameStyle } from '../types';
import { ClassicalFrame } from './ClassicalFrame';
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Heart,
  Calendar,
  MapPin,
  Download,
  Info,
  Upload,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LightboxModalProps {
  photo: PhotoItem | null;
  photos: PhotoItem[];
  frameStyle: FrameStyle;
  onClose: () => void;
  onSelectPhoto: (photo: PhotoItem) => void;
  onToggleFavorite: (id: string) => void;
  onReplaceSinglePhoto?: (id: string, newSrc: string, newTitle?: string) => void;
}

export const LightboxModal: React.FC<LightboxModalProps> = ({
  photo,
  photos,
  frameStyle,
  onClose,
  onSelectPhoto,
  onToggleFavorite,
  onReplaceSinglePhoto,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showDetails, setShowDetails] = useState(true);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !photo || !onReplaceSinglePhoto) return;

    const dataUrl = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.readAsDataURL(file);
    });

    const cleanTitle = file.name
      .replace(/\.[^/.]+$/, '')
      .replace(/[-_]/g, ' ')
      .trim();

    onReplaceSinglePhoto(photo.id, dataUrl, cleanTitle);
    e.target.value = '';
  };

  const currentIndex = photo ? photos.findIndex((p) => p.id === photo.id) : -1;

  const handleNext = () => {
    if (currentIndex >= 0 && currentIndex < photos.length - 1) {
      onSelectPhoto(photos[currentIndex + 1]);
      setZoomLevel(1);
    } else if (currentIndex === photos.length - 1) {
      onSelectPhoto(photos[0]);
      setZoomLevel(1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      onSelectPhoto(photos[currentIndex - 1]);
      setZoomLevel(1);
    } else if (currentIndex === 0) {
      onSelectPhoto(photos[photos.length - 1]);
      setZoomLevel(1);
    }
  };

  // Keyboard navigation & escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  if (!photo) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col justify-between select-none overflow-hidden"
      >
        {/* Top Header Controls Bar */}
        <div className="w-full flex items-center justify-between px-4 sm:px-8 py-3.5 border-b border-[#2d251a]/80 bg-[#0d0c0f]/90 z-50">
          <div className="flex items-center space-x-3">
            <span className="font-cinzel text-xs text-[#d4af37] font-semibold tracking-wider">
              {currentIndex + 1} / {photos.length}
            </span>
            <span className="text-[#524636]">|</span>
            <span className="font-serif-display text-sm text-[#f5dfa8] truncate max-w-[200px] sm:max-w-md">
              {photo.title}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {/* Zoom Controls */}
            <div className="flex items-center space-x-1 bg-[#151419] px-2 py-1 rounded-full border border-[#382f20]">
              <button
                onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 1))}
                disabled={zoomLevel <= 1}
                className="p-1 text-[#c5a059] disabled:opacity-30 hover:text-white"
                title="Reduzir Zoom"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-[11px] font-cinzel text-[#a89984] w-10 text-center">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 2.5))}
                disabled={zoomLevel >= 2.5}
                className="p-1 text-[#c5a059] disabled:opacity-30 hover:text-white"
                title="Aumentar Zoom"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              {zoomLevel > 1 && (
                <button
                  onClick={() => setZoomLevel(1)}
                  className="p-1 text-[#c5a059] hover:text-white ml-1 border-l border-[#382f20] pl-2"
                  title="Redefinir Zoom"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Swap Photo Button */}
            {onReplaceSinglePhoto && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  id="lightbox-swap-btn"
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 rounded-full bg-[#151419] border border-[#d4af37]/40 text-[#ffd97d] hover:bg-[#c5a059] hover:text-black transition-all cursor-pointer"
                  title="Trocar a imagem desta foto por outra do seu dispositivo"
                >
                  <Upload className="w-4 h-4" />
                </button>
              </>
            )}

            {/* Favorite button */}
            <button
              id="lightbox-fav-btn"
              onClick={() => onToggleFavorite(photo.id)}
              className="p-2 rounded-full bg-[#151419] border border-[#382f20] text-[#f5dfa8] hover:border-[#d4af37] transition-all"
              title="Favoritar Foto"
            >
              <Heart
                className={`w-4 h-4 ${
                  photo.isFavorite ? 'fill-[#e74c3c] text-[#e74c3c]' : 'text-[#f5dfa8]'
                }`}
              />
            </button>

            {/* Toggle Info details */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className={`p-2 rounded-full border transition-all ${
                showDetails
                  ? 'bg-[#c5a059]/20 border-[#c5a059] text-[#f5dfa8]'
                  : 'bg-[#151419] border-[#382f20] text-[#a69680] hover:text-white'
              }`}
              title="Alternar Detalhes da Foto"
            >
              <Info className="w-4 h-4" />
            </button>

            {/* Download */}
            <a
              href={photo.src}
              download={`${photo.title}.jpg`}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-full bg-[#151419] border border-[#382f20] text-[#a69680] hover:text-[#f5dfa8] hover:border-[#d4af37] transition-all"
              title="Baixar Foto"
            >
              <Download className="w-4 h-4" />
            </a>

            {/* Close button */}
            <button
              id="lightbox-close-btn"
              onClick={onClose}
              className="p-2 rounded-full bg-[#1e1b15] border border-[#d4af37]/60 text-[#f5dfa8] hover:bg-[#aa7a2c] hover:text-black transition-all ml-2"
              title="Fechar (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center Main Stage */}
        <div className="relative flex-1 flex items-center justify-center p-4 sm:p-8 overflow-hidden">
          {/* Navigation Arrows */}
          <button
            onClick={handlePrev}
            className="absolute left-3 sm:left-8 z-40 p-3 sm:p-4 rounded-full bg-black/70 border border-[#d4af37]/50 text-[#f5dfa8] hover:bg-[#252018] hover:scale-110 transition-all drop-shadow-xl"
            title="Foto Anterior (Seta Esquerda)"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={handleNext}
            className="absolute right-3 sm:right-8 z-40 p-3 sm:p-4 rounded-full bg-black/70 border border-[#d4af37]/50 text-[#f5dfa8] hover:bg-[#252018] hover:scale-110 transition-all drop-shadow-xl"
            title="Próxima Foto (Seta Direita)"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Framed Image Canvas */}
          <div className="max-w-4xl max-h-[75vh] flex items-center justify-center">
            <ClassicalFrame
              frameStyle={frameStyle}
              enableTilt={false}
              enableHoverZoom={false}
              caption={photo.title}
              subcaption={photo.subtitle}
              showPlaque={true}
              className="max-h-[70vh] flex items-center justify-center"
            >
              <div
                className="relative overflow-hidden flex items-center justify-center bg-black max-h-[65vh]"
                style={{
                  transform: `scale(${zoomLevel})`,
                  transition: 'transform 0.2s ease-out',
                  cursor: zoomLevel > 1 ? 'grab' : 'default',
                }}
              >
                <img
                  src={photo.src}
                  alt={photo.title}
                  referrerPolicy="no-referrer"
                  className="max-h-[65vh] w-auto object-contain select-none"
                  draggable={false}
                />
              </div>
            </ClassicalFrame>
          </div>
        </div>

        {/* Bottom Details Drawer */}
        {showDetails && (
          <div className="w-full bg-[#0d0c0f]/95 border-t border-[#2d251a]/80 p-4 sm:px-8 py-3 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-3 z-40">
            <div className="flex-1 max-w-3xl">
              <h3 className="font-serif-display text-lg text-gold-gradient font-bold">
                {photo.title} — <span className="font-cormorant italic text-[#d1baa0] font-normal">{photo.subtitle}</span>
              </h3>
              <p className="font-cormorant text-sm sm:text-base text-[#c9bea9] mt-0.5 leading-relaxed">
                {photo.description}
              </p>
            </div>

            <div className="flex items-center space-x-4 text-xs font-cormorant text-[#a69680]">
              <div className="flex items-center space-x-1">
                <Calendar className="w-3.5 h-3.5 text-[#c5a059]" />
                <span>{photo.date}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="w-3.5 h-3.5 text-[#c5a059]" />
                <span>{photo.location}</span>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};

import React, { useState } from 'react';
import { PhotoItem, FrameStyle } from '../types';
import { ClassicalFrame } from './ClassicalFrame';
import { ChevronLeft, ChevronRight, BookOpen, Quote, Calendar, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BookViewProps {
  photos: PhotoItem[];
  frameStyle: FrameStyle;
  onOpenLightbox: (photo: PhotoItem) => void;
}

export const BookView: React.FC<BookViewProps> = ({
  photos,
  frameStyle,
  onOpenLightbox,
}) => {
  const [spreadIndex, setSpreadIndex] = useState(0);

  // Each spread displays 2 items or 1 featured item + detailed editorial memoirs
  const totalSpreads = Math.ceil(photos.length / 2);
  const leftPhoto = photos[spreadIndex * 2];
  const rightPhoto = photos[spreadIndex * 2 + 1] || null;

  const handleNext = () => {
    if (spreadIndex < totalSpreads - 1) {
      setSpreadIndex(spreadIndex + 1);
    }
  };

  const handlePrev = () => {
    if (spreadIndex > 0) {
      setSpreadIndex(spreadIndex - 1);
    }
  };

  if (!leftPhoto) return null;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6 flex flex-col items-center">
      {/* Top Spread Controls */}
      <div className="w-full flex items-center justify-between mb-4 pb-3 border-b border-[#2a241b]">
        <div className="flex items-center space-x-2">
          <BookOpen className="w-4 h-4 text-[#c5a059]" />
          <span className="font-cinzel text-xs tracking-widest text-[#d4af37] font-semibold">
            PÁGINAS {spreadIndex * 2 + 1} - {Math.min(spreadIndex * 2 + 2, photos.length)}
          </span>
          <span className="text-[#594d3c]">/</span>
          <span className="text-xs text-[#8c806f] font-cinzel">TOTAL: {photos.length} FOTOS</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            id="book-prev-btn"
            onClick={handlePrev}
            disabled={spreadIndex === 0}
            className="px-3 py-1.5 rounded-full bg-[#151417] border border-[#382f20] text-xs font-cinzel text-[#d4af37] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#252018] flex items-center space-x-1 transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Página Anterior</span>
          </button>
          <button
            id="book-next-btn"
            onClick={handleNext}
            disabled={spreadIndex >= totalSpreads - 1}
            className="px-3 py-1.5 rounded-full bg-[#151417] border border-[#382f20] text-xs font-cinzel text-[#d4af37] disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#252018] flex items-center space-x-1 transition-all"
          >
            <span>Próxima Página</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* The Book Double Page Spread Container */}
      <AnimatePresence mode="wait">
        <motion.div
          key={spreadIndex}
          initial={{ opacity: 0, rotateY: -3 }}
          animate={{ opacity: 1, rotateY: 0 }}
          exit={{ opacity: 0, rotateY: 3 }}
          transition={{ duration: 0.5 }}
          className="relative w-full rounded-lg bg-gradient-to-r from-[#0d0c0a] via-[#151310] to-[#0d0c0a] border-2 border-[#3d321f] p-4 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.95)] overflow-hidden"
          style={{
            boxShadow: '0 0 50px rgba(0,0,0,0.9), inset 0 0 40px rgba(0,0,0,0.8)',
          }}
        >
          {/* Subtle Leather Texture Vignette */}
          <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#2a2214] via-transparent to-black" />

          {/* Book Spine Center Gutter Shadow & Golden Cord */}
          <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 pointer-events-none z-30">
            <div className="w-full h-full bg-gradient-to-r from-black/80 via-black/20 to-black/80 shadow-[inset_0_0_10px_rgba(0,0,0,0.9)]" />
            <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[1px] bg-gradient-to-b from-[#8f6d2b] via-[#f7e6b5] to-[#8f6d2b] opacity-60" />
          </div>

          {/* Spread Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 relative z-20">
            
            {/* Left Page: Grand Framed Artwork */}
            <div className="flex flex-col items-center justify-center p-2 sm:p-4">
              <ClassicalFrame
                frameStyle={frameStyle}
                enableTilt={true}
                enableHoverZoom={true}
                caption={leftPhoto.title}
                subcaption={leftPhoto.subtitle}
                showPlaque={true}
                className="w-full max-w-md"
                onClick={() => onOpenLightbox(leftPhoto)}
              >
                <div className="relative w-full aspect-[4/5] bg-black overflow-hidden">
                  <img
                    src={leftPhoto.src}
                    alt={leftPhoto.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              </ClassicalFrame>
              <span className="font-cinzel text-[11px] text-[#786c5a] mt-4">
                PÁGINA {spreadIndex * 2 + 1}
              </span>
            </div>

            {/* Right Page: Story & Secondary Picture OR Memoir Spread */}
            <div className="flex flex-col justify-between p-2 sm:p-4 border-t md:border-t-0 md:border-l border-[#2e261a]/60">
              {rightPhoto ? (
                <div className="flex flex-col items-center">
                  <ClassicalFrame
                    frameStyle={frameStyle}
                    enableTilt={true}
                    enableHoverZoom={true}
                    caption={rightPhoto.title}
                    subcaption={rightPhoto.subtitle}
                    showPlaque={true}
                    className="w-full max-w-md"
                    onClick={() => onOpenLightbox(rightPhoto)}
                  >
                    <div className="relative w-full aspect-[4/5] bg-black overflow-hidden">
                      <img
                        src={rightPhoto.src}
                        alt={rightPhoto.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </ClassicalFrame>

                  <div className="w-full mt-4 text-center">
                    <p className="font-cormorant italic text-sm sm:text-base text-[#d1baa0]">
                      "{rightPhoto.description}"
                    </p>
                  </div>
                </div>
              ) : (
                /* Poetic Memoir Page if only 1 photo in final spread */
                <div className="h-full flex flex-col justify-center items-center text-center px-4 py-8">
                  <div className="w-12 h-[1px] bg-[#d4af37] mb-6" />
                  <Quote className="w-8 h-8 text-[#d4af37]/60 mb-4" />
                  <h3 className="font-serif-display text-2xl sm:text-3xl text-gold-gradient mb-4 font-semibold">
                    Amor que Transcende o Tempo
                  </h3>
                  <p className="font-cormorant text-lg sm:text-xl text-[#ded3c3] leading-relaxed max-w-md italic mb-6">
                    "Cada foto guarda um suspiro, cada instante ao seu lado é uma memória bordada a ouro no livro da nossa história."
                  </p>
                  <p className="font-script text-3xl sm:text-4xl text-[#ebd29b] tracking-wider">
                    Igor & Adriana
                  </p>
                  <div className="w-12 h-[1px] bg-[#d4af37] mt-6" />
                </div>
              )}

              <div className="w-full flex items-center justify-between text-[11px] text-[#786c5a] font-cinzel mt-4 pt-3 border-t border-[#231e15]">
                <span>MEMÓRIAS ETERNAS</span>
                <span>PÁGINA {spreadIndex * 2 + 2}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

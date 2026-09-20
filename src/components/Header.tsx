import React from 'react';
import { ViewMode } from '../types';
import { Sparkles, Music, VolumeX, Volume2, Upload, BookOpen, LayoutGrid, Image as ImageIcon, Replace, Database } from 'lucide-react';

interface HeaderProps {
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
  isPlayingMusic: boolean;
  onToggleMusic: () => void;
  onOpenUploader: (mode?: 'replace' | 'append') => void;
  photosCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  onChangeViewMode,
  isPlayingMusic,
  onToggleMusic,
  onOpenUploader,
  photosCount,
}) => {
  return (
    <header className="w-full relative z-30 pt-8 pb-6 px-4 sm:px-6 flex flex-col items-center text-center">
      {/* Subtle Classical Monogram Crest */}
      <div className="flex items-center justify-center space-x-3 mb-3">
        <div className="w-12 sm:w-20 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37]/70 to-[#d4af37]" />
        
        <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-b from-[#1d1912] to-[#0a0a0c] border border-[#d4af37]/60 shadow-[0_0_20px_rgba(212,175,55,0.35)]">
          <span className="font-cinzel text-xs font-bold tracking-widest text-[#fce9b8] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
            I & A
          </span>
          <div className="absolute -inset-1 rounded-full border border-[#aa7a2c]/30 pointer-events-none" />
        </div>

        <div className="w-12 sm:w-20 h-[1px] bg-gradient-to-l from-transparent via-[#d4af37]/70 to-[#d4af37]" />
      </div>

      {/* Main Album Title: "Igor e Adriana" in elegant typography */}
      <h1 className="font-serif-display text-4xl sm:text-5xl md:text-6xl font-normal tracking-wide text-gold-gradient text-gold-glow mb-2">
        Igor e Adriana
      </h1>

      {/* Romantic Subtitle */}
      <p className="font-cormorant italic text-lg sm:text-xl text-[#d4c6b2] max-w-xl mx-auto tracking-wider">
        Uma História de Amor, Cumplicidade & Momentos Eternos
      </p>

      {/* Classical Filigree Flourish Divider */}
      <div className="w-28 sm:w-36 h-3 my-4 opacity-80">
        <svg viewBox="0 0 160 12" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path
            d="M0 6 Q40 0, 80 6 Q120 12, 160 6"
            stroke="url(#headerGold)"
            strokeWidth="1.2"
          />
          <circle cx="80" cy="6" r="3" fill="#ffe29a" />
          <circle cx="70" cy="6" r="1.5" fill="#aa7a2c" />
          <circle cx="90" cy="6" r="1.5" fill="#aa7a2c" />
          <defs>
            <linearGradient id="headerGold" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8c6418" stopOpacity="0" />
              <stop offset="50%" stopColor="#ffd97d" stopOpacity="1" />
              <stop offset="100%" stopColor="#8c6418" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Navigation View Modes & Actions Toolbar */}
      <div className="w-full max-w-2xl flex flex-wrap items-center justify-center sm:justify-between gap-3 mt-2 bg-[#121114]/90 p-1.5 sm:p-2 rounded-full border border-[#382f20]/80 shadow-[0_8px_25px_rgba(0,0,0,0.7)] backdrop-blur-md">
        
        {/* View Mode Buttons */}
        <div className="flex items-center space-x-1">
          <button
            id="view-carousel-btn"
            onClick={() => onChangeViewMode('carousel')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-cinzel transition-all ${
              viewMode === 'carousel'
                ? 'bg-gradient-to-r from-[#d4af37] to-[#aa7a2c] text-[#120f0a] font-bold shadow-[0_0_12px_rgba(212,175,55,0.4)]'
                : 'text-[#9b8d78] hover:text-[#ebd29b]'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Carrossel</span>
          </button>

          <button
            id="view-gallery-btn"
            onClick={() => onChangeViewMode('gallery')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-cinzel transition-all ${
              viewMode === 'gallery'
                ? 'bg-gradient-to-r from-[#d4af37] to-[#aa7a2c] text-[#120f0a] font-bold shadow-[0_0_12px_rgba(212,175,55,0.4)]'
                : 'text-[#9b8d78] hover:text-[#ebd29b]'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Galeria</span>
          </button>

          <button
            id="view-book-btn"
            onClick={() => onChangeViewMode('book')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-cinzel transition-all ${
              viewMode === 'book'
                ? 'bg-gradient-to-r from-[#d4af37] to-[#aa7a2c] text-[#120f0a] font-bold shadow-[0_0_12px_rgba(212,175,55,0.4)]'
                : 'text-[#9b8d78] hover:text-[#ebd29b]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Álbum Livro</span>
          </button>
        </div>

        {/* Right Action Tools: Music & Upload / Replace */}
        <div className="flex items-center space-x-2">
          {/* Cloud Database Synced Badge */}
          <div
            id="db-status-badge"
            className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-cinzel text-[#d4af37] bg-[#1a1712] border border-[#d4af37]/40 shadow-[0_0_8px_rgba(212,175,55,0.15)]"
            title="Banco de dados Cloud Firestore ativo - Todas as fotos estão sincronizadas e seguras na nuvem"
          >
            <Database className="w-3.5 h-3.5 text-[#ffd97d]" />
            <span className="text-[11px] tracking-wide">{photosCount} Fotos no Banco</span>
          </div>

          {/* Ambient Music Button */}
          <button
            id="music-toggle-btn"
            onClick={onToggleMusic}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-cinzel border transition-all ${
              isPlayingMusic
                ? 'bg-[#c5a059]/20 text-[#ffd97d] border-[#c5a059] shadow-[0_0_12px_rgba(212,175,55,0.3)]'
                : 'bg-[#151418] text-[#9b8d78] border-[#382f20] hover:text-[#ebd29b] hover:border-[#c5a059]/60'
            }`}
            title={isPlayingMusic ? 'Mudo' : 'Tocar Música Romântica Clássica'}
          >
            {isPlayingMusic ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#ffd97d] animate-pulse" />
                <span className="hidden sm:inline">Música On</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Música</span>
              </>
            )}
          </button>

          {/* Substitute Album Photos Button (High Visibility) */}
          <button
            id="substitute-album-btn"
            onClick={() => onOpenUploader('replace')}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-cinzel bg-gradient-to-r from-[#d4af37] via-[#ffd97d] to-[#aa7a2c] text-[#120f0a] font-bold shadow-[0_0_15px_rgba(212,175,55,0.4)] hover:brightness-110 transition-all cursor-pointer"
            title="Inserir novas fotos substituindo as já presentes no álbum"
          >
            <Replace className="w-3.5 h-3.5" />
            <span>Substituir Fotos</span>
          </button>

          {/* Add Photos Button */}
          <button
            id="open-uploader-btn"
            onClick={() => onOpenUploader('append')}
            className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-cinzel bg-[#1c1914] border border-[#c5a059]/40 text-[#f5dfa8] hover:bg-[#2e261a] hover:border-[#ffd97d] transition-all"
            title="Acrescentar mais fotos ao álbum"
          >
            <Upload className="w-3.5 h-3.5 text-[#c5a059]" />
            <span>Adicionar</span>
          </button>
        </div>
      </div>
    </header>
  );
};

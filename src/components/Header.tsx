import React from 'react';
import { ViewMode, AlbumConfig } from '../types';
import {
  Sparkles,
  Music,
  VolumeX,
  Volume2,
  Upload,
  BookOpen,
  LayoutGrid,
  Image as ImageIcon,
  Replace,
  Database,
  Download,
  FileSpreadsheet,
  Heart,
  Crown,
  Edit3,
} from 'lucide-react';

interface HeaderProps {
  viewMode: ViewMode;
  onChangeViewMode: (mode: ViewMode) => void;
  isPlayingMusic: boolean;
  onToggleMusic: () => void;
  onOpenMusicModal: () => void;
  onOpenUploader: (mode?: 'replace' | 'append') => void;
  photosCount: number;
  favoritesCount: number;
  config: AlbumConfig;
  onOpenNamesModal: () => void;
  onExportBackup?: () => void;
  isSavingCloud?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  onChangeViewMode,
  isPlayingMusic,
  onToggleMusic,
  onOpenMusicModal,
  onOpenUploader,
  photosCount,
  favoritesCount,
  config,
  onOpenNamesModal,
  onExportBackup,
  isSavingCloud = false,
}) => {
  return (
    <header className="w-full relative z-30 pt-8 pb-6 px-4 sm:px-6 flex flex-col items-center text-center">
      {/* Subtle Classical Monogram Crest - Studio IA */}
      <div className="flex items-center justify-center space-x-3 mb-3">
        <div className="w-12 sm:w-20 h-[1px] bg-gradient-to-r from-transparent via-[#d4af37]/70 to-[#d4af37]" />
        
        <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-b from-[#1d1912] to-[#0a0a0c] border border-[#d4af37]/60 shadow-[0_0_20px_rgba(212,175,55,0.35)]">
          <span className="font-cinzel text-xs font-bold tracking-widest text-[#fce9b8] drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
            IA
          </span>
          <div className="absolute -inset-1 rounded-full border border-[#aa7a2c]/30 pointer-events-none" />
        </div>

        <div className="w-12 sm:w-20 h-[1px] bg-gradient-to-l from-transparent via-[#d4af37]/70 to-[#d4af37]" />
      </div>

      {/* Main Album Title: "Studio IA" */}
      <h1 className="font-serif-display text-4xl sm:text-5xl md:text-6xl font-normal tracking-wide text-gold-gradient text-gold-glow mb-2">
        {config.studioName || 'Studio IA'}
      </h1>

      {/* Couple and Model Badges with Quick Edit */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
        {config.coupleName && (
          <span className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full text-xs font-cinzel bg-[#251f15] border border-[#d4af37]/40 text-[#ffd97d]">
            <Heart className="w-3 h-3 text-[#e74c3c] fill-[#e74c3c]" />
            <span>Casal: {config.coupleName}</span>
          </span>
        )}
        {config.modelName && (
          <span className="inline-flex items-center space-x-1.5 px-3 py-0.5 rounded-full text-xs font-cinzel bg-[#141d24] border border-[#38bdf8]/40 text-[#7dd3fc]">
            <Crown className="w-3 h-3 text-[#38bdf8]" />
            <span>Modelo: {config.modelName}</span>
          </span>
        )}
        <button
          onClick={onOpenNamesModal}
          className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-cinzel bg-[#151419] border border-[#4a3e2a] text-[#c5a059] hover:bg-[#252019] hover:border-[#ffd97d] transition-all cursor-pointer"
          title="Alterar Nome do Estúdio, Casal e Modelo"
        >
          <Edit3 className="w-3 h-3 text-[#d4af37]" />
          <span>Alterar Nomes</span>
        </button>
      </div>

      {/* Romantic Subtitle */}
      <p className="font-cormorant italic text-base sm:text-lg text-[#d4c6b2] max-w-2xl mx-auto tracking-wider">
        {config.subtitle || 'Álbum & Portfólio Fotográfico de Alta Costura | Memórias & Momentos Eternos'}
      </p>

      {/* Classical Filigree Flourish Divider */}
      <div className="w-28 sm:w-36 h-3 my-3 opacity-80">
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
      <div className="w-full max-w-5xl flex flex-wrap items-center justify-center sm:justify-between gap-2.5 mt-1 bg-[#121114]/90 p-1.5 sm:p-2 rounded-2xl sm:rounded-full border border-[#382f20]/80 shadow-[0_8px_25px_rgba(0,0,0,0.7)] backdrop-blur-md">
        
        {/* View Mode Buttons */}
        <div className="flex items-center space-x-1 overflow-x-auto pb-1 sm:pb-0">
          <button
            id="view-carousel-btn"
            onClick={() => onChangeViewMode('carousel')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-cinzel transition-all shrink-0 cursor-pointer ${
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
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-cinzel transition-all shrink-0 cursor-pointer ${
              viewMode === 'gallery'
                ? 'bg-gradient-to-r from-[#d4af37] to-[#aa7a2c] text-[#120f0a] font-bold shadow-[0_0_12px_rgba(212,175,55,0.4)]'
                : 'text-[#9b8d78] hover:text-[#ebd29b]'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Galeria</span>
          </button>

          {/* Favoritas Tab */}
          <button
            id="view-favorites-btn"
            onClick={() => onChangeViewMode('favorites')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-cinzel transition-all shrink-0 cursor-pointer ${
              viewMode === 'favorites'
                ? 'bg-gradient-to-r from-[#e74c3c] to-[#c0392b] text-white font-bold shadow-[0_0_12px_rgba(231,76,60,0.5)]'
                : 'text-[#ff7675] hover:text-[#ff9f43] bg-[#2a1313]/40 border border-[#5c1c1c]/50'
            }`}
            title="Ver Fotos Favoritas"
          >
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span>Favoritas</span>
            {favoritesCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/60 font-bold">
                {favoritesCount}
              </span>
            )}
          </button>

          <button
            id="view-book-btn"
            onClick={() => onChangeViewMode('book')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-cinzel transition-all shrink-0 cursor-pointer ${
              viewMode === 'book'
                ? 'bg-gradient-to-r from-[#d4af37] to-[#aa7a2c] text-[#120f0a] font-bold shadow-[0_0_12px_rgba(212,175,55,0.4)]'
                : 'text-[#9b8d78] hover:text-[#ebd29b]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Álbum Livro</span>
          </button>

          <button
            id="view-reports-btn"
            onClick={() => onChangeViewMode('reports')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-cinzel transition-all shrink-0 cursor-pointer ${
              viewMode === 'reports'
                ? 'bg-gradient-to-r from-[#cbd5e1] via-[#94a3b8] to-[#64748b] text-[#0f172a] font-bold shadow-[0_0_12px_rgba(203,213,225,0.5)]'
                : 'text-[#cbd5e1] hover:text-white bg-[#1e293b]/60 border border-[#334155]'
            }`}
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span>Relatórios & Clientes</span>
          </button>
        </div>

        {/* Right Action Tools: Music & Upload / Replace */}
        <div className="flex items-center space-x-2">
          {/* Cloud Database Synced Badge */}
          <div
            id="db-status-badge"
            className={`hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-cinzel border shadow-[0_0_8px_rgba(212,175,55,0.15)] transition-all ${
              isSavingCloud
                ? 'bg-[#2b2111] text-[#ffeaa7] border-[#ffd97d] animate-pulse'
                : 'text-[#d4af37] bg-[#1a1712] border-[#d4af37]/40'
            }`}
            title="Banco de dados Cloud Firestore ativo - Sincronizado na nuvem"
          >
            {isSavingCloud ? (
              <>
                <Database className="w-3.5 h-3.5 text-[#ffd97d] animate-spin" />
                <span className="text-[11px] tracking-wide">Salvando...</span>
              </>
            ) : (
              <>
                <Database className="w-3.5 h-3.5 text-[#ffd97d]" />
                <span className="text-[11px] tracking-wide">{photosCount} Fotos</span>
              </>
            )}
          </div>

          {/* Backup Export Button */}
          {onExportBackup && (
            <button
              id="export-backup-btn"
              onClick={onExportBackup}
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-cinzel bg-[#141217] border border-[#382f20] text-[#c5a059] hover:bg-[#252019] hover:border-[#d4af37] transition-all cursor-pointer"
              title="Baixar backup completo de todas as fotos em formato JSON"
            >
              <Download className="w-3 h-3 text-[#d4af37]" />
              <span>Backup</span>
            </button>
          )}

          {/* Inserir Música Button */}
          <button
            id="music-config-btn"
            onClick={onOpenMusicModal}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-cinzel border transition-all cursor-pointer ${
              isPlayingMusic
                ? 'bg-[#c5a059]/20 text-[#ffd97d] border-[#c5a059] shadow-[0_0_12px_rgba(212,175,55,0.3)]'
                : 'bg-[#151418] text-[#9b8d78] border-[#382f20] hover:text-[#ebd29b] hover:border-[#c5a059]/60'
            }`}
            title="Inserir ou escolher música para o álbum"
          >
            {isPlayingMusic ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#ffd97d] animate-pulse" />
                <span>Música</span>
              </>
            ) : (
              <>
                <Music className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Inserir Música</span>
              </>
            )}
          </button>

          {/* Substitute Album Photos Button */}
          <button
            id="substitute-album-btn"
            onClick={() => onOpenUploader('replace')}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full text-xs font-cinzel bg-gradient-to-r from-[#d4af37] via-[#ffd97d] to-[#aa7a2c] text-[#120f0a] font-bold shadow-[0_0_15px_rgba(212,175,55,0.4)] hover:brightness-110 transition-all cursor-pointer"
            title="Inserir novas fotos substituindo as já presentes no álbum"
          >
            <Replace className="w-3.5 h-3.5" />
            <span>Substituir</span>
          </button>

          {/* Add Photos Button */}
          <button
            id="open-uploader-btn"
            onClick={() => onOpenUploader('append')}
            className="hidden md:flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-cinzel bg-[#1c1914] border border-[#c5a059]/40 text-[#f5dfa8] hover:bg-[#2e261a] hover:border-[#ffd97d] transition-all cursor-pointer"
            title="Acrescentar mais fotos ao álbum mantendo as existentes"
          >
            <Upload className="w-3.5 h-3.5 text-[#c5a059]" />
            <span>Adicionar</span>
          </button>
        </div>
      </div>
    </header>
  );
};


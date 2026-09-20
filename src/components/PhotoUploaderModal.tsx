import React, { useState, useRef } from 'react';
import { PhotoItem, Category } from '../types';
import { compressImageFile } from '../utils/imageCompressor';
import {
  Upload,
  X,
  Image as ImageIcon,
  CheckCircle,
  RefreshCw,
  Trash2,
  Replace,
  Plus,
  Link as LinkIcon,
  Sparkles,
} from 'lucide-react';

interface PhotoUploaderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReplaceAllPhotos: (newPhotos: PhotoItem[]) => void;
  onAddPhotos: (newPhotos: PhotoItem[]) => void;
  onResetPhotos: () => void;
  currentCount: number;
  initialMode?: 'replace' | 'append';
}

export const PhotoUploaderModal: React.FC<PhotoUploaderModalProps> = ({
  isOpen,
  onClose,
  onReplaceAllPhotos,
  onAddPhotos,
  onResetPhotos,
  currentCount,
  initialMode = 'replace',
}) => {
  const [mode, setMode] = useState<'replace' | 'append'>(initialMode);
  const [dragActive, setDragActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stagedPhotos, setStagedPhotos] = useState<PhotoItem[]>([]);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [urlTitle, setUrlTitle] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setLoading(true);
    setSuccessMessage(null);

    const newPhotos: PhotoItem[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) continue;

      const dataUrl = await compressImageFile(file);
      if (!dataUrl) continue;

      // Format nice title from file name
      const cleanName = file.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[-_]/g, ' ')
        .replace(/\bIMG\b/gi, 'Foto')
        .replace(/\bWA\d+\b/gi, 'Momento Especial')
        .trim();

      // Guess category based on file name if possible
      let guessedCategory: Category = 'casal';
      const lower = file.name.toLowerCase();
      if (lower.includes('adriana') || lower.includes('noiva') || lower.includes('ela')) {
        guessedCategory = 'adriana';
      } else if (lower.includes('igor') || lower.includes('noivo') || lower.includes('ele')) {
        guessedCategory = 'igor';
      } else if (lower.includes('alianca') || lower.includes('anel') || lower.includes('ceu') || lower.includes('mar')) {
        guessedCategory = 'especial';
      }

      newPhotos.push({
        id: `photo-user-${Date.now()}-${i}-${Math.random().toString(36).substr(2, 5)}`,
        title: cleanName || `Momento Igor & Adriana ${i + 1}`,
        subtitle: 'Foto do Álbum',
        category: guessedCategory,
        date: new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }),
        location: 'Álbum Igor e Adriana',
        src: dataUrl,
        description: `Registro fotográfico adicionado com amor ao álbum de memórias de Igor e Adriana (${file.name}).`,
        isFavorite: false,
        aspectRatio: 'portrait',
      });
    }

    if (newPhotos.length > 0) {
      setStagedPhotos((prev) => [...prev, ...newPhotos]);
    }
    setLoading(false);
  };

  const handleAddFromUrl = () => {
    if (!urlInput.trim()) return;

    const newPhoto: PhotoItem = {
      id: `photo-url-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      title: urlTitle.trim() || `Momento Igor & Adriana ${stagedPhotos.length + 1}`,
      subtitle: 'Memória Importada',
      category: 'casal',
      date: new Date().toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }),
      location: 'Coleção Igor e Adriana',
      src: urlInput.trim(),
      description: 'Fotografia especial incluída no álbum de Igor e Adriana.',
      isFavorite: false,
      aspectRatio: 'portrait',
    };

    setStagedPhotos((prev) => [...prev, newPhoto]);
    setUrlInput('');
    setUrlTitle('');
  };

  const handleRemoveStaged = (index: number) => {
    setStagedPhotos((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleApply = () => {
    if (stagedPhotos.length === 0) return;

    if (mode === 'replace') {
      onReplaceAllPhotos(stagedPhotos);
      setSuccessMessage(
        `Todas as ${currentCount} fotos anteriores foram substituídas pelas ${stagedPhotos.length} novas fotos!`
      );
    } else {
      onAddPhotos(stagedPhotos);
      setSuccessMessage(
        `${stagedPhotos.length} novas fotos foram adicionadas com sucesso ao álbum!`
      );
    }

    setTimeout(() => {
      setStagedPhotos([]);
      onClose();
    }, 1200);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="w-full max-w-2xl bg-gradient-to-b from-[#141317] via-[#0f0e12] to-[#0a0a0c] border border-[#d4af37]/50 rounded-xl p-5 sm:p-7 shadow-[0_25px_60px_rgba(0,0,0,0.95)] relative max-h-[92vh] flex flex-col">
        
        {/* Close Button */}
        <button
          id="close-uploader-btn"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#1e1b15] text-[#d4af37] hover:bg-[#c5a059] hover:text-black transition-colors"
          title="Fechar"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center mb-5 shrink-0">
          <div className="inline-flex p-3 rounded-full bg-[#201c15] border border-[#d4af37]/40 text-[#d4af37] mb-2 shadow-[0_0_15px_rgba(212,175,55,0.2)]">
            <Replace className="w-6 h-6" />
          </div>
          <h3 className="font-serif-display text-2xl sm:text-3xl text-gold-gradient font-bold">
            Inserir Fotos no Álbum
          </h3>
          <p className="font-cormorant text-sm sm:text-base text-[#d1c5b4] mt-1">
            Substitua as imagens atuais pelas fotos reais de Igor e Adriana
          </p>
        </div>

        {/* Mode Selector Tabs: Substituir vs Acrescentar */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-[#0d0c0e] rounded-lg border border-[#382f20] mb-4 shrink-0">
          <button
            id="mode-replace-btn"
            onClick={() => setMode('replace')}
            className={`flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-xs font-cinzel transition-all ${
              mode === 'replace'
                ? 'bg-gradient-to-r from-[#d4af37] to-[#aa7a2c] text-[#120f0a] font-bold shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                : 'text-[#9e907c] hover:text-[#ebd29b]'
            }`}
          >
            <Replace className="w-3.5 h-3.5" />
            <span>Substituir Todas ({currentCount} fotos)</span>
          </button>

          <button
            id="mode-append-btn"
            onClick={() => setMode('append')}
            className={`flex items-center justify-center space-x-2 py-2 px-3 rounded-md text-xs font-cinzel transition-all ${
              mode === 'append'
                ? 'bg-gradient-to-r from-[#d4af37] to-[#aa7a2c] text-[#120f0a] font-bold shadow-[0_0_15px_rgba(212,175,55,0.4)]'
                : 'text-[#9e907c] hover:text-[#ebd29b]'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Acrescentar Fotos</span>
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          {/* Drag & Drop Zone */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
              dragActive
                ? 'border-[#fce9b8] bg-[#c5a059]/20 shadow-[0_0_30px_rgba(212,175,55,0.4)] scale-[1.01]'
                : 'border-[#453724] hover:border-[#d4af37] bg-[#121115]/80'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFiles(e.target.files)}
              className="hidden"
            />

            <div className="w-12 h-12 rounded-full bg-[#201c15] border border-[#d4af37]/40 flex items-center justify-center mx-auto mb-3 text-[#d4af37]">
              <Upload className="w-6 h-6" />
            </div>
            <p className="font-cinzel text-sm sm:text-base text-[#f7e8bc] font-bold">
              Clique aqui ou arraste suas fotos para o álbum
            </p>
            <p className="text-xs text-[#a69884] font-cormorant mt-1">
              Selecione todos os arquivos de imagem de uma só vez (PNG, JPG, JPEG, WEBP)
            </p>
            {mode === 'replace' && (
              <span className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-[#d4af37]/15 border border-[#d4af37]/40 text-[11px] font-cinzel text-[#ffd97d]">
                Modo Substituição: as imagens selecionadas serão as novas fotos do álbum
              </span>
            )}
          </div>

          {/* Quick URL Input (optional) */}
          <div className="bg-[#121114] p-3 rounded-lg border border-[#2c2419]">
            <span className="text-[11px] font-cinzel text-[#b5a794] block mb-2 flex items-center space-x-1">
              <LinkIcon className="w-3 h-3 text-[#c5a059]" />
              <span>Ou adicione por link de imagem direta:</span>
            </span>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="https://exemplo.com/minha-foto.jpg"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="flex-1 bg-[#0a0a0c] border border-[#382f20] rounded px-3 py-1.5 text-xs text-[#f2ede4] focus:outline-none focus:border-[#d4af37]"
              />
              <button
                type="button"
                onClick={handleAddFromUrl}
                disabled={!urlInput.trim()}
                className="px-3 py-1.5 rounded bg-[#241f17] border border-[#c5a059]/60 text-xs font-cinzel text-[#f5dfa8] hover:bg-[#3d321f] disabled:opacity-40"
              >
                Adicionar
              </button>
            </div>
          </div>

          {/* Staged Photos Preview Grid */}
          {stagedPhotos.length > 0 && (
            <div className="bg-[#121115] p-3 rounded-lg border border-[#d4af37]/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-cinzel text-[#ffd97d] font-semibold flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
                  <span>Fotos Prontas para Inserção ({stagedPhotos.length})</span>
                </span>
                <button
                  onClick={() => setStagedPhotos([])}
                  className="text-[11px] text-[#e74c3c] hover:underline flex items-center space-x-1 font-cinzel"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Limpar seleção</span>
                </button>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 max-h-48 overflow-y-auto p-1">
                {stagedPhotos.map((photo, index) => (
                  <div
                    key={photo.id}
                    className="relative group aspect-square rounded-sm overflow-hidden border border-[#d4af37]/40 bg-black"
                  >
                    <img
                      src={photo.src}
                      alt={photo.title}
                      className="w-full h-full object-cover"
                    />
                    <button
                      onClick={() => handleRemoveStaged(index)}
                      className="absolute top-1 right-1 p-1 rounded-full bg-black/80 text-[#e74c3c] opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Remover"
                    >
                      <X className="w-3 h-3" />
                    </button>
                    <div className="absolute bottom-0 inset-x-0 bg-black/75 text-[8px] text-[#ebd29b] truncate px-1 py-0.5 text-center font-cinzel">
                      {index + 1}. {photo.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Status message */}
          {successMessage && (
            <div className="p-3 rounded-md bg-[#1d2b1f] border border-[#2ecc71]/40 flex items-center space-x-2 text-xs text-[#a3e4d7] animate-pulse">
              <CheckCircle className="w-4 h-4 text-[#2ecc71] shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {loading && (
            <div className="text-center text-xs text-[#d4af37] font-cinzel py-2">
              Processando e otimizando fotografias...
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-4 pt-4 border-t border-[#2a241b] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <button
            id="reset-album-btn"
            onClick={() => {
              if (confirm('Deseja restaurar as memórias originais do álbum?')) {
                onResetPhotos();
                onClose();
              }
            }}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-cinzel text-[#ff7675] hover:bg-[#3d1818]/40 border border-[#5a2121]/60 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Restaurar Fotos Originais</span>
          </button>

          <div className="flex items-center space-x-2 ml-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-full border border-[#382f20] text-xs font-cinzel text-[#9e907c] hover:text-[#ebd29b]"
            >
              Cancelar
            </button>

            {stagedPhotos.length > 0 ? (
              <button
                id="confirm-substitute-btn"
                onClick={handleApply}
                className="flex items-center space-x-1.5 px-5 py-2 rounded-full bg-gradient-to-r from-[#d4af37] via-[#ffd97d] to-[#aa7a2c] text-[#120f0a] font-cinzel text-xs font-bold shadow-[0_0_15px_rgba(212,175,55,0.5)] hover:brightness-110 transition-all"
              >
                <Replace className="w-4 h-4" />
                <span>
                  {mode === 'replace'
                    ? `Substituir Álbum (${stagedPhotos.length} fotos)`
                    : `Adicionar ${stagedPhotos.length} Fotos`}
                </span>
              </button>
            ) : (
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center space-x-1.5 px-5 py-2 rounded-full bg-[#241f17] border border-[#d4af37]/50 text-[#f5dfa8] font-cinzel text-xs font-semibold hover:bg-[#382f20] transition-all"
              >
                <Upload className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Escolher Arquivos</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

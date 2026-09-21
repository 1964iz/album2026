import React, { useState } from 'react';
import { AlbumConfig } from '../types';
import {
  X,
  Sparkles,
  Heart,
  Camera,
  Check,
  RotateCcw,
  Crown,
} from 'lucide-react';

interface AlbumNamesModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: AlbumConfig;
  onSaveConfig: (newConfig: AlbumConfig) => void;
}

export const AlbumNamesModal: React.FC<AlbumNamesModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
}) => {
  const [studioName, setStudioName] = useState(config.studioName || 'Studio IA');
  const [coupleName, setCoupleName] = useState(config.coupleName || 'Novo Casal');
  const [modelName, setModelName] = useState(config.modelName || 'Modelo Principal');
  const [subtitle, setSubtitle] = useState(
    config.subtitle || 'Álbum & Portfólio Fotográfico de Alta Costura | Memórias & Momentos Eternos'
  );

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig({
      studioName: studioName.trim() || 'Studio IA',
      coupleName: coupleName.trim(),
      modelName: modelName.trim(),
      subtitle: subtitle.trim(),
    });
    onClose();
  };

  const handleResetDefaults = () => {
    setStudioName('Studio IA');
    setCoupleName('Novo Casal');
    setModelName('Modelo Principal');
    setSubtitle('Álbum & Portfólio Fotográfico de Alta Costura | Memórias & Momentos Eternos');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#0e0d11] border border-[#d4af37]/50 rounded-2xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.9)] relative flex flex-col space-y-4">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#1c1914] text-[#d4af37] hover:bg-[#c5a059] hover:text-black transition-colors cursor-pointer"
          title="Fechar"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex items-center space-x-3 pr-8">
          <div className="p-3 rounded-full bg-[#201c15] border border-[#d4af37]/40 text-[#ffd97d] shadow-[0_0_15px_rgba(212,175,55,0.3)]">
            <Crown className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif-display text-2xl text-[#f7e8bc] font-bold">
              Personalizar Nomes do Álbum
            </h3>
            <p className="text-xs text-[#a89b88] font-cormorant">
              Defina o nome do estúdio, do casal e dos modelos fotográficos
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4">
          {/* Nome do Estúdio */}
          <div>
            <label className="block text-xs font-cinzel text-[#ffd97d] mb-1.5 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Nome do Álbum / Estúdio:</span>
            </label>
            <input
              type="text"
              value={studioName}
              onChange={(e) => setStudioName(e.target.value)}
              placeholder="Ex: Studio IA"
              className="w-full px-3.5 py-2.5 bg-[#141217] border border-[#3b3223] rounded-lg text-sm font-cinzel text-[#fce9b8] focus:border-[#d4af37] outline-none"
              required
            />
          </div>

          {/* Nome do Casal */}
          <div>
            <label className="block text-xs font-cinzel text-[#ffd97d] mb-1.5 flex items-center space-x-1.5">
              <Heart className="w-3.5 h-3.5 text-[#e74c3c]" />
              <span>Nome do Casal:</span>
            </label>
            <input
              type="text"
              value={coupleName}
              onChange={(e) => setCoupleName(e.target.value)}
              placeholder="Ex: Gabriel & Mariana, Casal Real..."
              className="w-full px-3.5 py-2.5 bg-[#141217] border border-[#3b3223] rounded-lg text-sm text-[#f4efe6] focus:border-[#d4af37] outline-none"
            />
            <span className="text-[10px] text-[#8e816f] mt-1 block">
              Será exibido nas placas, capa do livro e cabeçalho do álbum
            </span>
          </div>

          {/* Nome de Modelo */}
          <div>
            <label className="block text-xs font-cinzel text-[#ffd97d] mb-1.5 flex items-center space-x-1.5">
              <Camera className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span>Nome de Modelo / Ensaio:</span>
            </label>
            <input
              type="text"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              placeholder="Ex: Modelo Fotográfico, Noiva Elegante, Editorial..."
              className="w-full px-3.5 py-2.5 bg-[#141217] border border-[#3b3223] rounded-lg text-sm text-[#f4efe6] focus:border-[#d4af37] outline-none"
            />
          </div>

          {/* Subtítulo / Descrição */}
          <div>
            <label className="block text-xs font-cinzel text-[#ffd97d] mb-1.5">
              Subtítulo do Álbum:
            </label>
            <textarea
              rows={2}
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Descrição ou frase romântica do álbum..."
              className="w-full px-3.5 py-2 bg-[#141217] border border-[#3b3223] rounded-lg text-xs text-[#d1c5b4] focus:border-[#d4af37] outline-none resize-none"
            />
          </div>

          {/* Live Preview Box */}
          <div className="p-3.5 rounded-xl bg-[#17151a] border border-[#352c1e] text-center">
            <span className="text-[10px] uppercase font-cinzel tracking-widest text-[#a1927e] block mb-1">
              Pré-visualização do Cabeçalho
            </span>
            <h4 className="font-serif-display text-2xl font-bold text-gold-gradient">
              {studioName || 'Studio IA'}
            </h4>
            <div className="flex items-center justify-center space-x-2 mt-1">
              {coupleName && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-cinzel bg-[#d4af37]/15 text-[#ffd97d] border border-[#d4af37]/30">
                  Casal: {coupleName}
                </span>
              )}
              {modelName && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-cinzel bg-[#38bdf8]/15 text-[#7dd3fc] border border-[#38bdf8]/30">
                  Modelo: {modelName}
                </span>
              )}
            </div>
            <p className="font-cormorant italic text-xs text-[#a89b88] mt-1.5 line-clamp-1">
              {subtitle}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleResetDefaults}
              className="text-xs font-cinzel text-[#8e816f] hover:text-[#d4af37] flex items-center space-x-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restaurar Padrão</span>
            </button>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-full border border-[#352c1e] text-xs font-cinzel text-[#a89b88] hover:text-[#ebd29b] cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-full bg-gradient-to-r from-[#d4af37] via-[#ffd97d] to-[#aa7a2c] text-[#0f0e09] font-cinzel text-xs font-bold shadow-lg hover:brightness-110 flex items-center space-x-1.5 cursor-pointer"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Salvar Nomes</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

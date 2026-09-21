import React from 'react';
import { Heart } from 'lucide-react';
import { AlbumConfig } from '../types';

interface FooterProps {
  config?: AlbumConfig;
}

export const Footer: React.FC<FooterProps> = ({ config }) => {
  return (
    <footer className="w-full relative z-20 py-12 px-4 text-center border-t border-[#241e15] mt-16 bg-[#080709]">
      <div className="max-w-md mx-auto flex flex-col items-center">
        {/* Studio IA Monogram */}
        <p className="font-serif-display text-2xl sm:text-3xl font-bold text-gold-gradient mb-1">
          {config?.studioName || 'Studio IA'}
        </p>

        {config?.coupleName && (
          <p className="text-xs font-cinzel text-[#ffd97d] mb-1">
            Ensaio & Coleção: {config.coupleName}
          </p>
        )}

        <p className="font-cormorant italic text-sm text-[#a89781] tracking-widest flex items-center justify-center space-x-1.5">
          <span>Eternizando os Melhores Momentos</span>
          <Heart className="w-3 h-3 text-[#c5a059] fill-[#c5a059]" />
          <span>em Alta Costura</span>
        </p>

        {/* Keyboard hints */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2 text-[10px] text-[#6e6353] font-cinzel">
          <span className="px-2 py-0.5 rounded bg-[#131215] border border-[#2d251a]">
            ← → Navegar
          </span>
          <span className="px-2 py-0.5 rounded bg-[#131215] border border-[#2d251a]">
            Espaço: Apresentação
          </span>
          <span className="px-2 py-0.5 rounded bg-[#131215] border border-[#2d251a]">
            Esc: Fechar Visualização
          </span>
        </div>
      </div>
    </footer>
  );
};


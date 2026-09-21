import React, { useState, useRef } from 'react';
import { FrameStyle } from '../types';

interface ClassicalFrameProps {
  children: React.ReactNode;
  frameStyle?: FrameStyle;
  className?: string;
  enableTilt?: boolean;
  enableHoverZoom?: boolean;
  caption?: string;
  subcaption?: string;
  showPlaque?: boolean;
  onClick?: () => void;
  aspectRatio?: 'portrait' | 'landscape' | 'square';
}

// Classical SVG Corner Flourish (Acanthus / Rococo Filigree)
const CornerFlourish: React.FC<{
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  color?: string;
  isSilver?: boolean;
}> = ({ position, color = '#d4af37', isSilver = false }) => {
  const rotationClass = {
    'top-left': 'top-1 left-1',
    'top-right': 'top-1 right-1 -scale-x-100',
    'bottom-left': 'bottom-1 left-1 -scale-y-100',
    'bottom-right': 'bottom-1 right-1 -scale-x-100 -scale-y-100',
  }[position];

  return (
    <div className={`absolute ${rotationClass} z-20 pointer-events-none w-10 h-10 md:w-14 md:h-14 opacity-90 transition-opacity duration-300 group-hover:opacity-100 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]`}>
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id={`grad-${position}-${isSilver ? 'silver' : 'gold'}`} x1="0%" y1="0%" x2="100%" y2="100%">
            {isSilver ? (
              <>
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="35%" stopColor="#e2e8f0" />
                <stop offset="70%" stopColor="#64748b" />
                <stop offset="100%" stopColor="#cbd5e1" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#fff1cc" />
                <stop offset="45%" stopColor={color} />
                <stop offset="85%" stopColor="#8c6418" />
                <stop offset="100%" stopColor="#ffd97d" />
              </>
            )}
          </linearGradient>
        </defs>

        {/* Outer Corner Arc & Fleurons */}
        <path
          d="M 4 4 L 4 32 C 4 20, 10 12, 22 8 C 28 6, 32 4, 32 4 Z"
          fill={`url(#grad-${position}-${isSilver ? 'silver' : 'gold'})`}
          opacity={isSilver ? "0.35" : "0.25"}
        />
        {/* Main Acanthus Scroll Branch */}
        <path
          d="M 3 3 L 3 36 C 4 24, 12 12, 28 6 C 36 3, 40 3, 40 3 C 32 6, 22 10, 16 16 C 10 22, 6 32, 3 36 Z"
          fill={`url(#grad-${position}-${isSilver ? 'silver' : 'gold'})`}
        />
        {/* Inner Floral Filigree Curve */}
        <path
          d="M 8 8 Q 8 22, 22 22 Q 22 8, 8 8 Z"
          fill={`url(#grad-${position}-${isSilver ? 'silver' : 'gold'})`}
          opacity="0.8"
        />
        {/* Delicate Rococo Spiral Curls */}
        <path
          d="M 3 3 L 48 3 C 44 6, 36 8, 28 10 C 18 13, 13 18, 10 28 C 8 36, 6 44, 3 48 Z"
          stroke={`url(#grad-${position}-${isSilver ? 'silver' : 'gold'})`}
          strokeWidth="1.2"
          fill="none"
        />
        <circle cx="15" cy="15" r="2.5" fill={`url(#grad-${position}-${isSilver ? 'silver' : 'gold'})`} />
        <circle cx="28" cy="8" r="1.5" fill={`url(#grad-${position}-${isSilver ? 'silver' : 'gold'})`} />
        <circle cx="8" cy="28" r="1.5" fill={`url(#grad-${position}-${isSilver ? 'silver' : 'gold'})`} />
        {/* Corner Tip Pearl */}
        <circle cx="5" cy="5" r="2" fill={isSilver ? "#ffffff" : "#fff9e6"} />
      </svg>
    </div>
  );
};

// Center Top/Bottom Medallion Emblem
const CenterMedallion: React.FC<{ isBottom?: boolean; color?: string; isSilver?: boolean }> = ({
  isBottom = false,
  color = '#d4af37',
  isSilver = false,
}) => {
  return (
    <div
      className={`absolute ${
        isBottom ? 'bottom-0 translate-y-1/2 rotate-180' : 'top-0 -translate-y-1/2'
      } left-1/2 -translate-x-1/2 z-20 pointer-events-none w-16 md:w-24 h-5 opacity-90 transition-opacity duration-300 group-hover:opacity-100`}
    >
      <svg viewBox="0 0 100 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
        <defs>
          <linearGradient id={`medallionGrad-${isSilver ? 'silver' : 'gold'}`} x1="0%" y1="0%" x2="100%" y2="0%">
            {isSilver ? (
              <>
                <stop offset="0%" stopColor="#64748b" />
                <stop offset="50%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#64748b" />
              </>
            ) : (
              <>
                <stop offset="0%" stopColor="#aa7a2c" />
                <stop offset="50%" stopColor="#ffe699" />
                <stop offset="100%" stopColor="#aa7a2c" />
              </>
            )}
          </linearGradient>
        </defs>
        {/* Horizontal Wings */}
        <path
          d="M 10 12 Q 35 6, 45 12 Q 35 18, 10 12 Z"
          fill={`url(#medallionGrad-${isSilver ? 'silver' : 'gold'})`}
        />
        <path
          d="M 90 12 Q 65 6, 55 12 Q 65 18, 90 12 Z"
          fill={`url(#medallionGrad-${isSilver ? 'silver' : 'gold'})`}
        />
        {/* Center Cartouche */}
        <ellipse cx="50" cy="12" rx="7" ry="5" fill={isSilver ? "#101319" : "#14120f"} stroke={`url(#medallionGrad-${isSilver ? 'silver' : 'gold'})`} strokeWidth="1.5" />
        <circle cx="50" cy="12" r="2.5" fill={isSilver ? "#ffffff" : "#ffe699"} />
        {/* Dots */}
        <circle cx="32" cy="12" r="1.5" fill={isSilver ? "#ffffff" : "#ffe699"} />
        <circle cx="68" cy="12" r="1.5" fill={isSilver ? "#ffffff" : "#ffe699"} />
      </svg>
    </div>
  );
};

export const ClassicalFrame: React.FC<ClassicalFrameProps> = ({
  children,
  frameStyle = 'baroque-gold',
  className = '',
  enableTilt = true,
  enableHoverZoom = true,
  caption,
  subcaption,
  showPlaque = false,
  onClick,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Frame Style color mappings
  const frameStylesConfig = {
    'baroque-gold': {
      outerBorder: 'border-[#c5a059]',
      glow: 'group-hover:shadow-[0_0_35px_rgba(212,175,55,0.3)]',
      mattingBg: 'bg-[#0f0e0c]',
      filigreeColor: '#d4af37',
      filletBorder: 'border-[#8f6a22]',
      accentGradient: 'from-[#ecc97b] via-[#b3852b] to-[#e4bd64]',
    },
    'imperial-silver': {
      outerBorder: 'border-[#b8c1cc]',
      glow: 'group-hover:shadow-[0_0_35px_rgba(184,193,204,0.3)]',
      mattingBg: 'bg-[#0d0f12]',
      filigreeColor: '#d1d8e0',
      filletBorder: 'border-[#6c7a89]',
      accentGradient: 'from-[#eef2f7] via-[#95a5a6] to-[#eef2f7]',
    },
    'rococo-filigree': {
      outerBorder: 'border-[#e0b777]',
      glow: 'group-hover:shadow-[0_0_40px_rgba(224,183,119,0.35)]',
      mattingBg: 'bg-[#12100e]',
      filigreeColor: '#f3c788',
      filletBorder: 'border-[#997334]',
      accentGradient: 'from-[#ffdfa9] via-[#cc9c4c] to-[#ffdfa9]',
    },
    'minimal-brass': {
      outerBorder: 'border-[#a8894d]',
      glow: 'group-hover:shadow-[0_0_25px_rgba(168,137,77,0.25)]',
      mattingBg: 'bg-[#0a0a0b]',
      filigreeColor: '#bf9b56',
      filletBorder: 'border-[#5f4922]',
      accentGradient: 'from-[#d8ba78] via-[#8c6d32] to-[#d8ba78]',
    },
  }[frameStyle];

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enableTilt || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    // Subtle natural tilt
    const rotX = ((y - centerY) / centerY) * -4;
    const rotY = ((x - centerX) / centerX) * 4;

    setRotateX(rotX);
    setRotateY(rotY);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
  };

  const isSilver = frameStyle === 'imperial-silver';

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        perspective: '1200px',
        transform: enableTilt ? `rotateX(${rotateX}deg) rotateY(${rotateY}deg)` : 'none',
        transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
      }}
      className={`group relative select-none cursor-pointer ${className}`}
    >
      {/* Classical Outer Molded Frame (Silver or Gilded) */}
      <div
        className={`relative p-3 sm:p-4 md:p-5 rounded-sm transition-all duration-700 ease-out shadow-[0_20px_50px_rgba(0,0,0,0.9)] ${
          isSilver
            ? 'group-hover:shadow-[0_0_40px_rgba(203,213,225,0.45)]'
            : frameStylesConfig.glow
        }`}
        style={{
          background: isSilver
            ? `radial-gradient(ellipse at center, #181d24 0%, #0d1015 85%, #06080b 100%)`
            : `radial-gradient(ellipse at center, #1c1a16 0%, #0c0b09 85%, #050505 100%)`,
          border: isSilver
            ? '2px solid rgba(203, 213, 225, 0.75)'
            : '1px solid rgba(212, 175, 55, 0.4)',
        }}
      >
        {/* Layer 1: Ornamental Bevel (Silver Leaf or Antique Gold Foil Rim) */}
        <div className="absolute inset-0 rounded-sm p-[3px] pointer-events-none">
          <div
            className="w-full h-full rounded-sm border-[2px] opacity-90 group-hover:opacity-100 transition-opacity"
            style={{
              borderImage: isSilver
                ? `linear-gradient(135deg, #ffffff 0%, #cbd5e1 20%, #64748b 45%, #e2e8f0 75%, #ffffff 100%) 1`
                : `linear-gradient(135deg, #f7e6b5 0%, #ab822e 25%, #664913 50%, #d4af37 75%, #f7e6b5 100%) 1`,
            }}
          />
        </div>

        {/* Layer 2: Classical Corner Filigree Flourishes */}
        <CornerFlourish position="top-left" color={frameStylesConfig.filigreeColor} isSilver={isSilver} />
        <CornerFlourish position="top-right" color={frameStylesConfig.filigreeColor} isSilver={isSilver} />
        <CornerFlourish position="bottom-left" color={frameStylesConfig.filigreeColor} isSilver={isSilver} />
        <CornerFlourish position="bottom-right" color={frameStylesConfig.filigreeColor} isSilver={isSilver} />

        {/* Layer 3: Center Crest Medallions */}
        <CenterMedallion isBottom={false} color={frameStylesConfig.filigreeColor} isSilver={isSilver} />
        <CenterMedallion isBottom={true} color={frameStylesConfig.filigreeColor} isSilver={isSilver} />

        {/* Layer 4: Museum Matting (Passe-partout) with Deep Shadow */}
        <div className={`relative p-2 md:p-3 rounded-[2px] shadow-[inset_0_4px_16px_rgba(0,0,0,0.95)] ${
          isSilver ? 'bg-[#0b0e13] border border-[#334155]/70' : 'bg-[#0c0c0e] border border-[#2c261b]/60'
        }`}>
          
          {/* Layer 5: Inner Fillet Liner (Silver or Gold Rim) */}
          <div className={`relative p-[2px] rounded-[1px] overflow-hidden ${
            isSilver
              ? 'border-2 border-[#e2e8f0]/90 shadow-[0_0_12px_rgba(226,232,240,0.45)]'
              : 'border border-[#d4af37]/35 shadow-[inset_0_0_8px_rgba(0,0,0,0.8)]'
          }`}>
            
            {/* The Actual Photo Image Container with Smooth Zoom Effect */}
            <div className="relative overflow-hidden w-full h-full rounded-[1px] bg-[#050505]">
              <div
                className={`w-full h-full transform transition-transform duration-700 ease-out ${
                  enableHoverZoom ? 'group-hover:scale-[1.08]' : ''
                }`}
              >
                {children}
              </div>

              {/* Interactive Specular Glare / Museum Glass Reflection on hover */}
              <div
                className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-25 transition-opacity duration-700 bg-gradient-to-tr from-transparent via-white to-transparent"
                style={{
                  transform: isHovered ? 'translateY(-10%) rotate(25deg)' : 'translateY(100%) rotate(25deg)',
                  transition: 'transform 0.8s ease-out, opacity 0.5s ease-out',
                }}
              />

              {/* Subtle Ambient Vignette on the artwork edges */}
              <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_24px_rgba(0,0,0,0.5)]" />
            </div>
          </div>
        </div>

        {/* Optional Classical Museum Engraved Plaque */}
        {showPlaque && (caption || subcaption) && (
          <div className={`mt-3 text-center px-2 py-1.5 rounded-sm relative overflow-hidden shadow-[0_4px_12px_rgba(0,0,0,0.7)] ${
            isSilver
              ? 'bg-gradient-to-b from-[#242b35] to-[#10141b] border border-[#cbd5e1]/60'
              : 'bg-gradient-to-b from-[#221e17] to-[#12100d] border border-[#a88434]/40'
          }`}>
            {/* Fine plaque screws */}
            <div className={`absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full ${
              isSilver ? 'bg-[#94a3b8] border border-[#f8fafc]' : 'bg-[#8c6d32] border border-[#f0d694]'
            }`} />
            <div className={`absolute right-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full ${
              isSilver ? 'bg-[#94a3b8] border border-[#f8fafc]' : 'bg-[#8c6d32] border border-[#f0d694]'
            }`} />

            {caption && (
              <h4 className={`font-cinzel text-xs md:text-sm font-semibold tracking-widest uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] ${
                isSilver ? 'text-[#f8fafc]' : 'text-[#f5dfa8]'
              }`}>
                {caption}
              </h4>
            )}
            {subcaption && (
              <p className={`font-cormorant italic text-[11px] md:text-xs mt-0.5 tracking-wider ${
                isSilver ? 'text-[#cbd5e1]' : 'text-[#d1baa0]'
              }`}>
                {subcaption}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

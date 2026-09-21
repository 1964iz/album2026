import React, { useState, useRef } from 'react';
import { romanticAudio, AudioPreset } from '../utils/audio';
import {
  X,
  Music,
  Volume2,
  VolumeX,
  Upload,
  Link as LinkIcon,
  Play,
  Pause,
  Sparkles,
  Disc,
} from 'lucide-react';

interface MusicModalProps {
  isOpen: boolean;
  onClose: () => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
}

export const MusicModal: React.FC<MusicModalProps> = ({
  isOpen,
  onClose,
  isPlaying,
  onTogglePlay,
}) => {
  const [activePreset, setActivePreset] = useState<AudioPreset>('piano');
  const [volume, setVolume] = useState<number>(romanticAudio.getVolume());
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [customName, setCustomName] = useState<string>('');
  const [isCustomLoaded, setIsCustomLoaded] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleSelectPreset = (preset: AudioPreset) => {
    setActivePreset(preset);
    setIsCustomLoaded(false);
    romanticAudio.setPreset(preset);
    if (!isPlaying) {
      onTogglePlay();
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileUrl = URL.createObjectURL(file);
    const cleanName = file.name.replace(/\.[^/.]+$/, '');
    setCustomName(cleanName);
    setIsCustomLoaded(true);
    romanticAudio.setCustomAudio(fileUrl, cleanName);
    if (!isPlaying) {
      onTogglePlay();
    }
    e.target.value = '';
  };

  const handleApplyUrl = () => {
    if (!audioUrl.trim()) return;
    const name = customName.trim() || 'Faixa de Áudio Web';
    setCustomName(name);
    setIsCustomLoaded(true);
    romanticAudio.setCustomAudio(audioUrl.trim(), name);
    if (!isPlaying) {
      onTogglePlay();
    }
    setAudioUrl('');
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    setVolume(newVol);
    romanticAudio.setVolume(newVol);
  };

  const handleResetToPresets = () => {
    setIsCustomLoaded(false);
    romanticAudio.clearCustomAudio();
    romanticAudio.setPreset(activePreset);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#0e0d11] border border-[#d4af37]/50 rounded-2xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.9)] relative flex flex-col space-y-5">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-[#1c1914] text-[#d4af37] hover:bg-[#c5a059] hover:text-black transition-colors cursor-pointer"
          title="Fechar"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center space-x-3 pr-8">
          <div className="p-3 rounded-full bg-[#201c15] border border-[#d4af37]/40 text-[#ffd97d] shadow-[0_0_15px_rgba(212,175,55,0.3)]">
            <Music className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif-display text-2xl text-[#f7e8bc] font-bold">
              Trilha Sonora do Álbum
            </h3>
            <p className="text-xs text-[#a89b88] font-cormorant">
              Escolha uma trilha instrumental suave ou insira sua própria música
            </p>
          </div>
        </div>

        {/* Currently Playing Card */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-[#17141b] via-[#1b171f] to-[#141217] border border-[#3d3324] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2.5 rounded-full ${isPlaying ? 'bg-[#c5a059]/20 text-[#ffd97d] animate-pulse' : 'bg-black/40 text-[#71685a]'}`}>
              <Disc className={`w-5 h-5 ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#a3937c] font-cinzel block">
                {isPlaying ? 'Tocando Agora' : 'Pausado'}
              </span>
              <h4 className="text-sm font-cinzel font-semibold text-[#f5dfa8]">
                {romanticAudio.getTrackTitle()}
              </h4>
            </div>
          </div>

          <button
            onClick={onTogglePlay}
            className={`px-4 py-2 rounded-full font-cinzel text-xs font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
              isPlaying
                ? 'bg-[#2b2416] border border-[#d4af37]/50 text-[#ffd97d] hover:bg-[#3d321d]'
                : 'bg-gradient-to-r from-[#d4af37] to-[#aa7a2c] text-[#0f0e0a] hover:brightness-110 shadow-[0_0_15px_rgba(212,175,55,0.4)]'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pausar</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Tocar</span>
              </>
            )}
          </button>
        </div>

        {/* Volume Slider */}
        <div className="flex items-center space-x-3 px-1">
          {volume === 0 ? (
            <VolumeX className="w-4 h-4 text-[#8a7e6d]" />
          ) : (
            <Volume2 className="w-4 h-4 text-[#d4af37]" />
          )}
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={handleVolumeChange}
            className="flex-1 accent-[#d4af37] h-1.5 bg-[#252019] rounded-lg cursor-pointer"
          />
          <span className="text-xs font-cinzel text-[#a89b88] w-10 text-right">
            {Math.round(volume * 100)}%
          </span>
        </div>

        {/* Sound Presets */}
        <div className="space-y-2">
          <span className="text-xs font-cinzel text-[#ffd97d] flex items-center space-x-1">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Trilhas Clássicas Acústicas</span>
          </span>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleSelectPreset('piano')}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                !isCustomLoaded && activePreset === 'piano'
                  ? 'bg-[#252018] border-[#d4af37] shadow-[0_0_12px_rgba(212,175,55,0.3)]'
                  : 'bg-[#121115] border-[#2f271c] hover:border-[#8f743c] text-[#a1927e]'
              }`}
            >
              <h5 className="text-xs font-cinzel font-bold text-[#f7e8bc]">Pianoforte</h5>
              <p className="text-[10px] text-[#8e816f] mt-0.5">Acordes serenos</p>
            </button>

            <button
              onClick={() => handleSelectPreset('harp')}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                !isCustomLoaded && activePreset === 'harp'
                  ? 'bg-[#252018] border-[#d4af37] shadow-[0_0_12px_rgba(212,175,55,0.3)]'
                  : 'bg-[#121115] border-[#2f271c] hover:border-[#8f743c] text-[#a1927e]'
              }`}
            >
              <h5 className="text-xs font-cinzel font-bold text-[#f7e8bc]">Harpa</h5>
              <p className="text-[10px] text-[#8e816f] mt-0.5">Arpejos líricos</p>
            </button>

            <button
              onClick={() => handleSelectPreset('strings')}
              className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                !isCustomLoaded && activePreset === 'strings'
                  ? 'bg-[#252018] border-[#d4af37] shadow-[0_0_12px_rgba(212,175,55,0.3)]'
                  : 'bg-[#121115] border-[#2f271c] hover:border-[#8f743c] text-[#a1927e]'
              }`}
            >
              <h5 className="text-xs font-cinzel font-bold text-[#f7e8bc]">Cordas</h5>
              <p className="text-[10px] text-[#8e816f] mt-0.5">Serenata suave</p>
            </button>
          </div>
        </div>

        {/* Upload Custom Audio File / Link */}
        <div className="p-4 rounded-xl bg-[#131216] border border-[#352c1e] space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-cinzel text-[#ffd97d] flex items-center space-x-1.5">
              <Upload className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Inserir Sua Música (Arquivo do Dispositivo)</span>
            </span>

            {isCustomLoaded && (
              <button
                onClick={handleResetToPresets}
                className="text-[10px] font-cinzel text-[#ff9f43] hover:underline cursor-pointer"
              >
                Voltar aos Instrumentais
              </button>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*,.mp3,.wav,.ogg,.m4a,.aac"
            onChange={handleFileUpload}
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full py-2.5 px-4 rounded-lg border border-dashed border-[#d4af37]/60 bg-[#1e1a14]/60 hover:bg-[#2b241b] text-[#ffd97d] text-xs font-cinzel flex items-center justify-center space-x-2 transition-all cursor-pointer"
          >
            <Upload className="w-4 h-4 text-[#ffd97d]" />
            <span>Selecionar Áudio (MP3, WAV, M4A)</span>
          </button>

          {/* Direct Audio URL */}
          <div className="pt-2 border-t border-[#262016] flex items-center space-x-2">
            <div className="relative flex-1">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#887b6a]" />
              <input
                type="url"
                value={audioUrl}
                onChange={(e) => setAudioUrl(e.target.value)}
                placeholder="Ou cole URL direta de áudio (.mp3)..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#0b0a0d] border border-[#2b251a] rounded-lg text-[#ebd29b] focus:border-[#d4af37] outline-none"
              />
            </div>
            <button
              onClick={handleApplyUrl}
              disabled={!audioUrl.trim()}
              className="px-3 py-1.5 rounded-lg bg-[#252018] border border-[#d4af37]/50 text-[#ffd97d] text-xs font-cinzel hover:bg-[#342b1f] disabled:opacity-40 cursor-pointer"
            >
              Carregar
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center pt-1">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full bg-gradient-to-r from-[#d4af37] to-[#aa7a2c] text-[#0f0e09] font-cinzel text-xs font-bold shadow-lg hover:brightness-110 cursor-pointer"
          >
            Concluir & Ouvir Álbum
          </button>
        </div>
      </div>
    </div>
  );
};

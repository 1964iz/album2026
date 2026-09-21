/**
 * Romantic ambient soundscape and custom music player for Studio IA
 * Supports Web Audio API synthesized classical chords (Piano, Harp, Strings)
 * and custom uploaded/linked audio tracks (MP3/WAV/AAC)
 */

export type AudioPreset = 'piano' | 'harp' | 'strings';

class RomanticSoundscape {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private timer: number | null = null;
  private volume = 0.6;
  private currentPreset: AudioPreset = 'piano';
  private audioElement: HTMLAudioElement | null = null;
  private customTrackTitle: string | null = null;
  private listeners: Array<(playing: boolean, title: string) => void> = [];

  private presets: Record<AudioPreset, number[][]> = {
    piano: [
      // Fmaj9: F3, C4, E4, G4, A4
      [174.61, 261.63, 329.63, 392.00, 440.00],
      // Dm9: D3, A3, C4, E4, F4
      [146.83, 220.00, 261.63, 329.63, 349.23],
      // Bbmaj7: Bb2, F3, A3, D4, F4
      [116.54, 174.61, 220.00, 293.66, 349.23],
      // C6/9: C3, G3, D4, E4, A4
      [130.81, 196.00, 293.66, 329.63, 440.00]
    ],
    harp: [
      // Gmaj9
      [196.00, 293.66, 369.99, 440.00, 587.33],
      // Em9
      [164.81, 246.94, 329.63, 392.00, 493.88],
      // Cmaj9
      [130.81, 261.63, 329.63, 392.00, 493.88],
      // D7sus4
      [146.83, 220.00, 293.66, 392.00, 587.33]
    ],
    strings: [
      // A minor lush pad
      [110.00, 220.00, 261.63, 329.63, 440.00],
      // F major 7
      [87.31, 174.61, 261.63, 329.63, 349.23],
      // C major 9
      [130.81, 196.00, 261.63, 329.63, 392.00],
      // G6
      [98.00, 196.00, 246.94, 293.66, 392.00]
    ]
  };

  private chordIndex = 0;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  private playTone(freq: number, delay: number, duration: number, gainMultiplier = 1) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime + delay;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    const isStrings = this.currentPreset === 'strings';
    const isHarp = this.currentPreset === 'harp';

    filter.type = isStrings ? 'bandpass' : 'lowpass';
    filter.frequency.setValueAtTime(isStrings ? 600 : isHarp ? 1200 : 800, now);
    filter.frequency.exponentialRampToValueAtTime(300, now + duration);

    osc.type = isStrings ? 'sawtooth' : isHarp ? 'sine' : 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    const baseGain = (isStrings ? 0.03 : 0.07) * this.volume * gainMultiplier;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(baseGain, now + (isStrings ? 0.4 : 0.08));
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.1);
  }

  private playArpeggio() {
    if (!this.isPlaying || !this.ctx || this.audioElement) return;
    const chordsList = this.presets[this.currentPreset];
    const chord = chordsList[this.chordIndex];
    this.chordIndex = (this.chordIndex + 1) % chordsList.length;

    chord.forEach((freq, idx) => {
      const delay = idx * (this.currentPreset === 'harp' ? 0.25 : 0.38) + (Math.random() * 0.03);
      const dur = 3.6 + Math.random() * 0.8;
      const vol = 0.85 + Math.random() * 0.3;
      this.playTone(freq, delay, dur, vol);
    });

    this.timer = window.setTimeout(() => {
      this.playArpeggio();
    }, 4000);
  }

  private notify() {
    this.listeners.forEach((l) => l(this.isPlaying, this.getTrackTitle()));
  }

  public subscribe(listener: (playing: boolean, title: string) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  public setCustomAudio(urlOrDataUrl: string, title = 'Música Personalizada') {
    this.stop();
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement = null;
    }
    const audio = new Audio(urlOrDataUrl);
    audio.loop = true;
    audio.volume = this.volume;
    this.audioElement = audio;
    this.customTrackTitle = title;
    this.start();
  }

  public clearCustomAudio() {
    this.stop();
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement = null;
    }
    this.customTrackTitle = null;
  }

  public setPreset(preset: AudioPreset) {
    this.currentPreset = preset;
    if (this.audioElement) {
      this.clearCustomAudio();
    }
    if (this.isPlaying) {
      if (this.timer) clearTimeout(this.timer);
      this.playArpeggio();
    }
    this.notify();
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.audioElement) {
      this.audioElement.volume = this.volume;
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public getTrackTitle(): string {
    if (this.customTrackTitle) return this.customTrackTitle;
    switch (this.currentPreset) {
      case 'harp':
        return 'Harpa Imperial Clássica';
      case 'strings':
        return 'Serenata de Cordas Suaves';
      case 'piano':
      default:
        return 'Pianoforte Romântico Suave';
    }
  }

  public toggle(): boolean {
    if (this.isPlaying) {
      this.stop();
      return false;
    } else {
      this.start();
      return true;
    }
  }

  public start() {
    try {
      this.isPlaying = true;
      if (this.audioElement) {
        this.audioElement.play().catch((err) => {
          console.warn('Audio play hindered', err);
        });
      } else {
        this.initCtx();
        this.playArpeggio();
      }
      this.notify();
    } catch (e) {
      console.warn('Audio playback error', e);
    }
  }

  public stop() {
    this.isPlaying = false;
    if (this.audioElement) {
      this.audioElement.pause();
    }
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.notify();
  }

  public getStatus(): boolean {
    return this.isPlaying;
  }
}

export const romanticAudio = new RomanticSoundscape();


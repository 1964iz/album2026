/**
 * Romantic ambient soundscape generator using Web Audio API
 * Generates warm, gentle piano / harp chords in F major / D minor
 */

class RomanticSoundscape {
  private ctx: AudioContext | null = null;
  private isPlaying = false;
  private timer: number | null = null;

  private chords = [
    // Fmaj9: F3, C4, E4, G4, A4
    [174.61, 261.63, 329.63, 392.00, 440.00],
    // Dm9: D3, A3, C4, E4, F4
    [146.83, 220.00, 261.63, 329.63, 349.23],
    // Bbmaj7: Bb2, F3, A3, D4, F4
    [116.54, 174.61, 220.00, 293.66, 349.23],
    // C6/9: C3, G3, D4, E4, A4
    [130.81, 196.00, 293.66, 329.63, 440.00]
  ];
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

  private playTone(freq: number, delay: number, duration: number, gainValue = 0.08) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime + delay;
    
    // Main soft oscillator (sine + soft triangle blend)
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.exponentialRampToValueAtTime(300, now + duration);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(gainValue, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + duration + 0.1);
  }

  private playArpeggio() {
    if (!this.isPlaying || !this.ctx) return;
    const chord = this.chords[this.chordIndex];
    this.chordIndex = (this.chordIndex + 1) % this.chords.length;

    // Pluck notes with subtle rhythmic spacing
    chord.forEach((freq, idx) => {
      const delay = idx * 0.35 + (Math.random() * 0.04);
      const dur = 3.5 + Math.random() * 0.8;
      const vol = 0.05 + Math.random() * 0.03;
      this.playTone(freq, delay, dur, vol);
    });

    this.timer = window.setTimeout(() => {
      this.playArpeggio();
    }, 3800);
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
      this.initCtx();
      this.isPlaying = true;
      this.playArpeggio();
    } catch (e) {
      console.warn('Audio playback error', e);
    }
  }

  public stop() {
    this.isPlaying = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  public getStatus(): boolean {
    return this.isPlaying;
  }
}

export const romanticAudio = new RomanticSoundscape();

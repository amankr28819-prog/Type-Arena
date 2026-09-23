import type { SoundProfile } from '../types';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private volume: number = 0.6;
  private isMuted: boolean = false;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public playKeystroke(profile: SoundProfile) {
    if (this.isMuted || profile === 'off' || this.volume <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    switch (profile) {
      case 'clicky': {
        // Cherry MX Blue style: sharp transient click + subtle spring resonance
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        filter.type = 'highpass';
        filter.frequency.setValueAtTime(1400, now);

        osc.type = 'sine';
        // Random micro-pitch variation for realistic feel
        const pitch = 2200 + Math.random() * 400;
        osc.frequency.setValueAtTime(pitch, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.03);

        const targetVol = this.volume * 0.45;
        gain.gain.setValueAtTime(targetVol, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.04);
        break;
      }

      case 'tactile': {
        // Cherry MX Brown: softer, mid-frequency bump
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        const pitch = 650 + Math.random() * 120;
        osc.frequency.setValueAtTime(pitch, now);
        osc.frequency.exponentialRampToValueAtTime(250, now + 0.04);

        const targetVol = this.volume * 0.4;
        gain.gain.setValueAtTime(targetVol, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.045);
        break;
      }

      case 'linear': {
        // Cherry MX Red: deep smooth bottom-out thock
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        const pitch = 380 + Math.random() * 80;
        osc.frequency.setValueAtTime(pitch, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.05);

        const targetVol = this.volume * 0.5;
        gain.gain.setValueAtTime(targetVol, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.055);
        break;
      }

      case 'typewriter': {
        // Vintage heavy mechanical typewriter strike
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(1800, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.045);

        const targetVol = this.volume * 0.35;
        gain.gain.setValueAtTime(targetVol, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.045);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.05);
        break;
      }

      case 'beep': {
        // 8-bit retro terminal chip sound
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(880 + Math.random() * 80, now);

        const targetVol = this.volume * 0.25;
        gain.gain.setValueAtTime(targetVol, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.035);
        break;
      }
    }
  }

  public playErrorSound() {
    if (this.isMuted || this.volume <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(110, now + 0.12);

    const targetVol = this.volume * 0.4;
    gain.gain.setValueAtTime(targetVol, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.13);
  }

  public playSuccessChime() {
    if (this.isMuted || this.volume <= 0) return;
    this.initContext();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const now = this.ctx.currentTime + idx * 0.08;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(this.volume * 0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.26);
    });
  }
}

export const soundEngine = new SoundEngine();

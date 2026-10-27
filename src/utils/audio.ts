/**
 * Web Audio API synthesizer for Lomba Cerdas Cermat timer.
 * Produces crisp, synchronized countdown ticks and an authoritative game-show buzzer.
 * 100% synthetic, zero external network requests or audio files required.
 */

class SoundController {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private activeBuzzerNodes: { oscs: OscillatorNode[]; gain: GainNode } | null = null;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public initOnUserGesture(): void {
    const ctx = this.getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopAllAudio();
    }
    return this.isMuted;
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (this.isMuted) {
      this.stopAllAudio();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Play high-precision synchronized countdown tick.
   * @param isUrgent true during final 10 seconds
   */
  public playTick(isUrgent: boolean): void {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;

      if (!isUrgent) {
        // Standard tick: crisp high-end studio countdown click
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(1400, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.04);

        filter.type = 'highpass';
        filter.frequency.setValueAtTime(300, now);

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.35, now + 0.003);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.05);
      } else {
        // Urgent tick (final 10 seconds): punchy, dramatic tension tick
        // 1. High transient snap
        const clickOsc = ctx.createOscillator();
        const clickGain = ctx.createGain();

        clickOsc.type = 'triangle';
        clickOsc.frequency.setValueAtTime(1800, now);
        clickOsc.frequency.exponentialRampToValueAtTime(600, now + 0.05);

        clickGain.gain.setValueAtTime(0.001, now);
        clickGain.gain.linearRampToValueAtTime(0.45, now + 0.003);
        clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

        clickOsc.connect(clickGain);
        clickGain.connect(ctx.destination);

        clickOsc.start(now);
        clickOsc.stop(now + 0.065);

        // 2. Low resonant punch body for added urgency
        const punchOsc = ctx.createOscillator();
        const punchGain = ctx.createGain();

        punchOsc.type = 'sine';
        punchOsc.frequency.setValueAtTime(280, now);
        punchOsc.frequency.exponentialRampToValueAtTime(110, now + 0.08);

        punchGain.gain.setValueAtTime(0.001, now);
        punchGain.gain.linearRampToValueAtTime(0.4, now + 0.005);
        punchGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);

        punchOsc.connect(punchGain);
        punchGain.connect(ctx.destination);

        punchOsc.start(now);
        punchOsc.stop(now + 0.09);
      }
    } catch {
      // Audio playback fails gracefully if context blocked
    }
  }

  /**
   * Play authoritative tournament buzzer when timer hits 00:00.
   * Lasts ~1.5 seconds. Stops immediately if reset or muted.
   */
  public playBuzzer(): void {
    if (this.isMuted) return;
    this.stopAllAudio(); // Clear any existing buzzer

    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const duration = 1.5;

      const masterGain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(750, now);
      filter.Q.setValueAtTime(2.5, now);

      // Harsh game-show buzzer sound using dual detuned sawtooth waves
      const osc1 = ctx.createOscillator();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(155, now);

      const osc2 = ctx.createOscillator();
      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(195, now); // Dissonant interval

      const osc3 = ctx.createOscillator();
      osc3.type = 'square';
      osc3.frequency.setValueAtTime(78, now); // Sub-bass body

      masterGain.gain.setValueAtTime(0.001, now);
      masterGain.gain.linearRampToValueAtTime(0.55, now + 0.03);
      masterGain.gain.setValueAtTime(0.55, now + duration - 0.2);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc1.connect(filter);
      osc2.connect(filter);
      osc3.connect(filter);
      filter.connect(masterGain);
      masterGain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc3.start(now);

      osc1.stop(now + duration + 0.05);
      osc2.stop(now + duration + 0.05);
      osc3.stop(now + duration + 0.05);

      this.activeBuzzerNodes = {
        oscs: [osc1, osc2, osc3],
        gain: masterGain,
      };

      setTimeout(() => {
        if (this.activeBuzzerNodes?.gain === masterGain) {
          this.activeBuzzerNodes = null;
        }
      }, (duration + 0.1) * 1000);
    } catch {
      // Audio playback fails gracefully
    }
  }

  /**
   * Immediately stops any playing sounds (e.g. on RESET or PAUSE).
   */
  public stopAllAudio(): void {
    if (this.activeBuzzerNodes) {
      try {
        const { oscs, gain } = this.activeBuzzerNodes;
        gain.gain.setValueAtTime(0.0001, this.ctx ? this.ctx.currentTime : 0);
        oscs.forEach((osc) => {
          try {
            osc.stop();
            osc.disconnect();
          } catch {}
        });
      } catch {}
      this.activeBuzzerNodes = null;
    }
  }
}

export const soundController = new SoundController();

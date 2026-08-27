export class AudioController {
  constructor() {
    this.enabled = false;
    this.context = null;
    this.failure = null;
  }

  ensureContext() {
    if (this.context) return this.context;
    const Context = window.AudioContext || window.webkitAudioContext;
    if (!Context) return null;
    try {
      this.context = new Context();
      return this.context;
    } catch (error) {
      this.failure = error;
      return null;
    }
  }

  async setEnabled(enabled) {
    if (!enabled) {
      this.enabled = false;
      return false;
    }
    const context = this.ensureContext();
    if (!context) {
      this.enabled = false;
      return false;
    }
    try {
      if (context.state === "suspended") await context.resume();
      this.enabled = true;
      return true;
    } catch (error) {
      this.failure = error;
      this.enabled = false;
      return false;
    }
  }

  async toggle() {
    return this.setEnabled(!this.enabled);
  }

  tone(frequency, duration = 0.08, type = "sine", volume = 0.035) {
    if (!this.enabled) return;
    const context = this.context;
    if (!context) return;
    try {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const start = context.currentTime;
      oscillator.type = type;
      oscillator.frequency.setValueAtTime(frequency, start);
      gain.gain.setValueAtTime(volume, start);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start(start);
      oscillator.stop(start + duration);
    } catch (error) {
      this.failure = error;
    }
  }

  playStep() { this.tone(440, 0.06, "triangle", 0.025); }
  playError() { this.tone(150, 0.11, "sine", 0.025); }
  playSuccess() {
    this.tone(523.25, 0.08, "triangle", 0.025);
    window.setTimeout(() => this.tone(659.25, 0.12, "triangle", 0.025), 75);
  }
}

"use client";

import { useGame } from "./store";

// All sounds are synthesised with the Web Audio API, so there are no audio files to load.

let ctx: AudioContext | null = null;
let noise: AudioBuffer | null = null;

function audio() {
  if (typeof window === "undefined" || !useGame.getState().sound) return null;
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function noiseBuffer(c: AudioContext) {
  if (noise) return noise;
  noise = c.createBuffer(1, c.sampleRate, c.sampleRate);
  const d = noise.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return noise;
}

function envGain(c: AudioContext, peak: number, attack: number, decay: number) {
  const g = c.createGain();
  const t = c.currentTime;
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
  g.connect(c.destination);
  return g;
}

function tone(type: OscillatorType, freq: number, peak: number, decay: number, endFreq?: number) {
  const c = audio();
  if (!c) return;
  const o = c.createOscillator();
  o.type = type;
  o.frequency.setValueAtTime(freq, c.currentTime);
  if (endFreq) o.frequency.exponentialRampToValueAtTime(endFreq, c.currentTime + decay);
  o.connect(envGain(c, peak, 0.004, decay));
  o.start();
  o.stop(c.currentTime + decay + 0.05);
}

function burst(filterType: BiquadFilterType, freq: number, q: number, peak: number, decay: number) {
  const c = audio();
  if (!c) return;
  const src = c.createBufferSource();
  src.buffer = noiseBuffer(c);
  const f = c.createBiquadFilter();
  f.type = filterType;
  f.frequency.value = freq;
  f.Q.value = q;
  src.connect(f).connect(envGain(c, peak, 0.01, decay));
  src.start();
  src.stop(c.currentTime + decay + 0.05);
}

/** Unlock audio on the first user gesture (browsers require it). */
export function unlockAudio() {
  audio();
}

export const sfx = {
  bounce(strength: number) {
    const s = Math.min(1, strength / 6);
    if (s < 0.08) return;
    tone("sine", 150, 0.5 * s, 0.18, 55);
    burst("lowpass", 400, 1, 0.25 * s, 0.08);
  },
  rim(strength: number) {
    const s = Math.min(1, strength / 5);
    if (s < 0.05) return;
    tone("triangle", 920, 0.18 * s, 0.35);
    tone("square", 1380, 0.05 * s, 0.22);
  },
  board(strength: number) {
    const s = Math.min(1, strength / 6);
    if (s < 0.05) return;
    burst("bandpass", 700, 2, 0.45 * s, 0.14);
    tone("sine", 210, 0.2 * s, 0.12, 120);
  },
  swish() {
    burst("highpass", 2500, 0.7, 0.35, 0.32);
  },
  score() {
    tone("triangle", 660, 0.12, 0.15);
    setTimeout(() => tone("triangle", 990, 0.12, 0.25), 90);
  },
  buzzer() {
    tone("sawtooth", 196, 0.18, 1.1);
    tone("square", 233, 0.08, 1.1);
  },
  click() {
    tone("sine", 520, 0.06, 0.05);
  },

  /** Crowd roar: a swell of band-passed noise plus a few rising "whoo" voices. */
  cheer(level = 1) {
    const c = audio();
    if (!c) return;
    const t = c.currentTime;
    const src = c.createBufferSource();
    src.buffer = noiseBuffer(c);
    src.loop = true;
    const f = c.createBiquadFilter();
    f.type = "bandpass";
    f.frequency.value = 1100;
    f.Q.value = 0.6;
    const g = c.createGain();
    const peak = 0.16 + 0.08 * level;
    const len = 1.6 + 0.6 * level;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(peak, t + 0.25);
    g.gain.exponentialRampToValueAtTime(peak * 0.6, t + len * 0.6);
    g.gain.exponentialRampToValueAtTime(0.0001, t + len);
    src.connect(f).connect(g).connect(c.destination);
    src.start(t, Math.random());
    src.stop(t + len + 0.05);

    for (let i = 0; i < 4 + level * 3; i++) {
      const start = t + Math.random() * 0.5;
      const o = c.createOscillator();
      o.type = "triangle";
      const base = 380 + Math.random() * 420;
      o.frequency.setValueAtTime(base, start);
      o.frequency.exponentialRampToValueAtTime(base * 1.45, start + 0.35);
      o.frequency.exponentialRampToValueAtTime(base * 1.15, start + 0.9);
      const vib = c.createOscillator();
      vib.frequency.value = 5 + Math.random() * 3;
      const vibAmt = c.createGain();
      vibAmt.gain.value = base * 0.02;
      vib.connect(vibAmt).connect(o.frequency);
      const vg = c.createGain();
      vg.gain.setValueAtTime(0.0001, start);
      vg.gain.exponentialRampToValueAtTime(0.022, start + 0.12);
      vg.gain.exponentialRampToValueAtTime(0.0001, start + 1);
      o.connect(vg).connect(c.destination);
      o.start(start);
      vib.start(start);
      o.stop(start + 1.05);
      vib.stop(start + 1.05);
    }
  },

  /** Big-moment celebration: rhythmic claps and a stadium air horn. */
  celebrate() {
    const c = audio();
    if (!c) return;
    const t = c.currentTime;
    for (let beat = 0; beat < 6; beat++) {
      for (let hand = 0; hand < 3; hand++) {
        const at = t + 0.45 + beat * 0.24 + Math.random() * 0.03;
        const src = c.createBufferSource();
        src.buffer = noiseBuffer(c);
        const f = c.createBiquadFilter();
        f.type = "bandpass";
        f.frequency.value = 1400 + Math.random() * 900;
        f.Q.value = 1.2;
        const g = c.createGain();
        g.gain.setValueAtTime(0.0001, at);
        g.gain.exponentialRampToValueAtTime(0.18, at + 0.004);
        g.gain.exponentialRampToValueAtTime(0.0001, at + 0.07);
        src.connect(f).connect(g).connect(c.destination);
        src.start(at, Math.random() * 0.9);
        src.stop(at + 0.08);
      }
    }
    const lp = c.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 2200;
    const hg = c.createGain();
    hg.gain.setValueAtTime(0.0001, t);
    hg.gain.exponentialRampToValueAtTime(0.09, t + 0.03);
    hg.gain.setValueAtTime(0.09, t + 0.7);
    hg.gain.exponentialRampToValueAtTime(0.0001, t + 0.95);
    lp.connect(hg).connect(c.destination);
    for (const freq of [233, 294, 349]) {
      const o = c.createOscillator();
      o.type = "sawtooth";
      o.frequency.value = freq;
      o.connect(lp);
      o.start(t);
      o.stop(t + 1);
    }
  },

  /** Rex's roar: a low growl with a rasp on top. */
  roar() {
    const c = audio();
    if (!c) return;
    const t = c.currentTime;
    const o = c.createOscillator();
    o.type = "sawtooth";
    o.frequency.setValueAtTime(95, t);
    o.frequency.exponentialRampToValueAtTime(140, t + 0.25);
    o.frequency.exponentialRampToValueAtTime(60, t + 1.1);
    const trem = c.createOscillator();
    trem.frequency.value = 23;
    const tremAmt = c.createGain();
    tremAmt.gain.value = 0.35;
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.32, t + 0.12);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);
    trem.connect(tremAmt).connect(g.gain);
    const lp = c.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = 900;
    o.connect(lp).connect(g).connect(c.destination);
    o.start(t);
    trem.start(t);
    o.stop(t + 1.25);
    trem.stop(t + 1.25);
    burst("bandpass", 450, 1.4, 0.3, 1.0);
  },

  /** Disappointed "aww" after a shot that rattled out. */
  groan() {
    const c = audio();
    if (!c) return;
    const t = c.currentTime;
    for (let i = 0; i < 6; i++) {
      const o = c.createOscillator();
      o.type = "sawtooth";
      const base = 170 + Math.random() * 90;
      o.frequency.setValueAtTime(base * 1.12, t);
      o.frequency.exponentialRampToValueAtTime(base * 0.82, t + 0.9);
      const f = c.createBiquadFilter();
      f.type = "bandpass";
      f.frequency.value = 750;
      f.Q.value = 3;
      const g = c.createGain();
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.03, t + 0.12);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 1);
      o.connect(f).connect(g).connect(c.destination);
      o.start(t);
      o.stop(t + 1.05);
    }
  },
};

// ---- crowd murmur that runs under the whole game ----
let bed: { src: AudioBufferSourceNode; lfo: OscillatorNode } | null = null;

export function crowdBed(on: boolean) {
  if (!on) {
    if (bed) {
      bed.src.stop();
      bed.lfo.stop();
      bed = null;
    }
    return;
  }
  const c = audio();
  if (!c || bed) return;
  const src = c.createBufferSource();
  src.buffer = noiseBuffer(c);
  src.loop = true;
  const lp = c.createBiquadFilter();
  lp.type = "lowpass";
  lp.frequency.value = 650;
  const g = c.createGain();
  g.gain.value = 0.035;
  // slow swell so the murmur breathes instead of hissing
  const lfo = c.createOscillator();
  lfo.frequency.value = 0.17;
  const lfoAmt = c.createGain();
  lfoAmt.gain.value = 0.012;
  lfo.connect(lfoAmt).connect(g.gain);
  src.connect(lp).connect(g).connect(c.destination);
  src.start();
  lfo.start();
  bed = { src, lfo };
}

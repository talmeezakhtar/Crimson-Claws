"use client";

import { create } from "zustand";
import { SPOTS } from "./court";
import { LIGHTING_ORDER, type LightingName } from "./lighting";
import type { BallId } from "./balls";

export type Mode = "shootaround" | "challenge";
export type Phase = "menu" | "playing" | "over";
export type CameraName = "shooter" | "broadcast" | "top";
export const CAMERA_ORDER: CameraName[] = ["shooter", "broadcast", "top"];

export const CHALLENGE_SECONDS = 60;
const BEST_KEY = "hoops-best-score";

export type ShotEvent = { id: number; kind: "make" | "swish" | "miss"; points: number; three: boolean; line: string };

type GameState = {
  mode: Mode;
  phase: Phase;
  score: number;
  made: number;
  attempts: number;
  streak: number;
  bestStreak: number;
  timeLeft: number;
  best: number;
  spotIndex: number;
  ball: BallId;
  lighting: LightingName;
  camera: CameraName;
  sound: boolean;
  lastEvent: ShotEvent | null;
  resetToken: number;

  start: (mode: Mode) => void;
  toMenu: () => void;
  tick: (seconds: number) => void;
  registerAttempt: () => void;
  registerMake: (opts: { swish: boolean; three: boolean; line: string }) => void;
  registerMiss: (line: string) => void;
  nextSpot: () => void;
  chooseSpot: (index: number) => void;
  setBall: (ball: BallId) => void;
  setLighting: (l: LightingName) => void;
  cycleLighting: () => void;
  cycleCamera: () => void;
  toggleSound: () => void;
  resetBall: () => void;
};

let eventId = 0;

function readBest() {
  try {
    return Number(localStorage.getItem(BEST_KEY)) || 0;
  } catch {
    return 0;
  }
}

export const useGame = create<GameState>((set, get) => ({
  mode: "shootaround",
  phase: "menu",
  score: 0,
  made: 0,
  attempts: 0,
  streak: 0,
  bestStreak: 0,
  timeLeft: CHALLENGE_SECONDS,
  best: 0,
  spotIndex: 0,
  ball: "classic",
  lighting: "night",
  camera: "shooter",
  sound: true,
  lastEvent: null,
  resetToken: 0,

  start: (mode) =>
    set((s) => ({
      mode,
      phase: "playing",
      score: 0,
      made: 0,
      attempts: 0,
      streak: 0,
      bestStreak: 0,
      timeLeft: CHALLENGE_SECONDS,
      spotIndex: mode === "challenge" ? 0 : s.spotIndex,
      best: readBest(),
      lastEvent: null,
      resetToken: s.resetToken + 1,
    })),

  toMenu: () => set({ phase: "menu" }),

  tick: (seconds) => {
    const s = get();
    if (s.phase !== "playing" || s.mode !== "challenge") return;
    const timeLeft = Math.max(0, s.timeLeft - seconds);
    if (timeLeft === 0) {
      const best = Math.max(s.best, s.score);
      try {
        localStorage.setItem(BEST_KEY, String(best));
      } catch {}
      set({ timeLeft, phase: "over", best });
    } else {
      set({ timeLeft });
    }
  },

  registerAttempt: () => set((s) => ({ attempts: s.attempts + 1 })),

  registerMake: ({ swish, three, line }) =>
    set((s) => {
      const streak = s.streak + 1;
      const onFire = streak >= 4; // 4th make in a row and beyond
      const points = (three ? 3 : 2) + (swish ? 1 : 0) + (onFire ? 1 : 0);
      const score = s.score + points;
      // A buzzer-beater after the clock hit zero still updates the best score.
      let best = s.best;
      if (s.phase === "over" && score > best) {
        best = score;
        try {
          localStorage.setItem(BEST_KEY, String(best));
        } catch {}
      }
      return {
        score,
        best,
        made: s.made + 1,
        streak,
        bestStreak: Math.max(s.bestStreak, streak),
        lastEvent: { id: ++eventId, kind: swish ? "swish" : "make", points, three, line },
      };
    }),

  registerMiss: (line) =>
    set({ streak: 0, lastEvent: { id: ++eventId, kind: "miss", points: 0, three: false, line } }),

  // Challenge goes around the world; in shootaround the player picks the spot.
  nextSpot: () =>
    set((s) => (s.mode === "challenge" ? { spotIndex: (s.spotIndex + 1) % SPOTS.length } : {})),
  chooseSpot: (spotIndex) => set((s) => ({ spotIndex, resetToken: s.resetToken + 1 })),
  setBall: (ball) => set({ ball }),

  setLighting: (lighting) => set({ lighting }),
  cycleLighting: () =>
    set((s) => ({
      lighting: LIGHTING_ORDER[(LIGHTING_ORDER.indexOf(s.lighting) + 1) % LIGHTING_ORDER.length],
    })),
  cycleCamera: () =>
    set((s) => ({ camera: CAMERA_ORDER[(CAMERA_ORDER.indexOf(s.camera) + 1) % CAMERA_ORDER.length] })),
  toggleSound: () => set((s) => ({ sound: !s.sound })),
  resetBall: () => set((s) => ({ resetToken: s.resetToken + 1 })),
}));

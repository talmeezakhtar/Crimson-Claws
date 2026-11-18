// Mutable per-frame state shared between scene components without React re-renders.

export type AimInput = {
  active: boolean;
  dx: number;
  dy: number;
  fire: boolean; // set on release, consumed by the ball
};

export const aim: AimInput = { active: false, dx: 0, dy: 0, fire: false };

export type ShotState = {
  inFlight: boolean;
  releasedAt: number;
  touchedRim: boolean;
  touchedBoard: boolean;
  scored: boolean;
  scoredAt: number;
  three: boolean;
};

export const shot: ShotState = {
  inFlight: false,
  releasedAt: 0,
  touchedRim: false,
  touchedBoard: false,
  scored: false,
  scoredAt: 0,
  three: false,
};

/** Time (s, scene clock) the net was last hit, drives the net sway. */
export const net = { kickAt: -10, strength: 0 };

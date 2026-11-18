"use client";

import type { RapierRigidBody } from "@react-three/rapier";
import { aim, net, shot } from "./runtime";
import { sfx } from "./audio";
import { useGame } from "./store";
import { announce, commentMake } from "./commentary";
import { HALF_COURT_SPOT } from "./court";

export const now = () => performance.now() / 1000;

export const refs: { ball: RapierRigidBody | null; showcase: boolean } = { ball: null, showcase: false };

// Dev-only handle for debugging shots from the browser console.
if (process.env.NODE_ENV !== "production" && typeof window !== "undefined") {
  (window as unknown as { __hoops: unknown }).__hoops = { refs, shot, aim, net };
}

/** Called when the ball enters the sensor under the rim. */
export function onScoreSensor() {
  const ball = refs.ball;
  if (!ball || !shot.inFlight || shot.scored) return;
  // Only count balls dropping down through the hoop, never ones coming up from below.
  if (ball.linvel().y >= 0) return;

  shot.scored = true;
  shot.scoredAt = now();
  const swish = !shot.touchedRim && !shot.touchedBoard;
  net.kickAt = now();
  net.strength = swish ? 1 : 0.75;

  if (swish) sfx.swish();
  else sfx.bounce(1.5);
  if (refs.showcase) return;
  sfx.score();
  const g = useGame.getState();
  const line = commentMake({
    swish,
    board: shot.touchedBoard,
    three: shot.three,
    halfCourt: g.spotIndex === HALF_COURT_SPOT,
    streak: g.streak + 1,
  });
  g.registerMake({ swish, three: shot.three, line: line.text });
  announce(line);
  const big = swish || shot.three || useGame.getState().streak >= 4;
  sfx.cheer(big ? 3 : 1);
  if (big) sfx.celebrate();
}

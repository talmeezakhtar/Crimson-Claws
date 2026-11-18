"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { sfx } from "@/lib/audio";
import { announce, comment } from "@/lib/commentary";
import { useGame } from "@/lib/store";
import Arena from "./Arena";
import Rex from "@/components/mascot/Rex";
import { net } from "@/lib/runtime";
import Ball from "./Ball";
import CameraRig from "./CameraRig";
import Court from "./Court";
import Hoop from "./Hoop";
import LightRig from "./LightRig";

/** Saves the current frame as a PNG. Set by the scene once the renderer exists. */
export const photo: { capture: (() => string) | null } = { capture: null };

function PhotoBridge() {
  const gl = useThree((s) => s.gl);
  useEffect(() => {
    photo.capture = () => gl.domElement.toDataURL("image/png");
    return () => {
      photo.capture = null;
    };
  }, [gl]);
  return null;
}

/** Counts the challenge clock down in 0.1 s steps and sounds the buzzer at zero. */
function GameClock() {
  const acc = useRef(0);
  useFrame((_, dt) => {
    const g = useGame.getState();
    if (g.phase !== "playing" || g.mode !== "challenge") return;
    acc.current += Math.min(dt, 0.25);
    if (acc.current < 0.1) return;
    const bestBefore = g.best;
    g.tick(acc.current);
    acc.current = 0;
    const after = useGame.getState();
    if (after.phase === "over") {
      sfx.buzzer();
      // a beat after the horn, the announcer has the last word
      setTimeout(() => announce(comment(after.score > bestBefore && after.score > 0 ? "newbest" : "buzzer")), 900);
    }
  });
  return null;
}

export default function Scene({ showcase = false }: { showcase?: boolean }) {
  const lowPower =
    typeof window !== "undefined" && (window.matchMedia("(pointer: coarse)").matches || window.innerWidth < 768);

  return (
    <Canvas
      shadows="percentage"
      flat
      dpr={[1, lowPower ? 1.5 : 2]}
      camera={{ fov: showcase ? 45 : 52, near: 0.1, far: 400, position: [0, 5, 14] }}
      gl={{ antialias: true, preserveDrawingBuffer: !showcase, powerPreference: "high-performance" }}
    >
      <Suspense fallback={null}>
        <LightRig lowPower={lowPower} />
        <Physics gravity={[0, -9.81, 0]} timeStep={1 / 120}>
          <Court />
          <Hoop />
          <Ball showcase={showcase} />
        </Physics>
        <Arena />
        {/* Rex courtside: celebrates every basket */}
        <Rex position={[-9, 0, 1.2]} rotation-y={1.25} cheerAt={() => net.kickAt} />
        <CameraRig showcase={showcase} />
        {!showcase && <GameClock />}
        {!showcase && <PhotoBridge />}
      </Suspense>
    </Canvas>
  );
}

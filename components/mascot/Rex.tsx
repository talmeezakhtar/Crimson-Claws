"use client";

import { useEffect, useMemo, useRef, type ReactNode } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Outlines, RoundedBox } from "@react-three/drei";
import { makeBallTexture } from "@/components/game/Ball";
import { ballById } from "@/lib/balls";
import { drawWithFonts, displayFont, INK, toonGradient } from "@/lib/toon";

// Rex, the Crimson Claws mascot: a toon raptor in the club jersey, built from primitives.
// Facing +z, feet on y = 0, about 2.3 m tall.

const SKIN = "#8a1420";
const SKIN_DARK = "#5c070e";
const CREAM = "#fff0dc";
const BONE = "#f3e6c8";
const GOLD = "#d9a441";
const EYE = "#f2c14e";

function useToon(color: string, map?: THREE.Texture) {
  return useMemo(() => new THREE.MeshToonMaterial({ color, map: map ?? null, gradientMap: toonGradient() }), [color, map]);
}

function jerseyTexture() {
  const c = document.createElement("canvas");
  c.width = 1024;
  c.height = 512;
  const g = c.getContext("2d")!;
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  drawWithFonts(t, () => {
    g.fillStyle = CREAM;
    g.fillRect(0, 0, 1024, 512);
    // collar and hem trim
    g.fillStyle = "#790b13";
    g.fillRect(0, 0, 1024, 26);
    g.fillRect(0, 486, 1024, 26);
    g.fillStyle = GOLD;
    g.fillRect(0, 26, 1024, 8);
    g.fillRect(0, 478, 1024, 8);
    // side panels
    for (const x of [256, 768]) {
      g.fillStyle = "#790b13";
      g.fillRect(x - 14, 0, 28, 512);
    }
    const lettering = (text: string, x: number, y: number, size: number) => {
      g.font = displayFont(size);
      g.textAlign = "center";
      g.textBaseline = "middle";
      g.lineWidth = size * 0.09;
      g.strokeStyle = GOLD;
      g.strokeText(text, x, y);
      g.fillStyle = "#790b13";
      g.fillText(text, x, y);
    };
    // front: canvas centre faces forward once the mesh is turned a quarter turn
    lettering("CLAWS", 512, 175, 120);
    lettering("15", 512, 340, 190);
    // back, split across the seam
    for (const x of [0, 1024]) {
      lettering("REX", x, 140, 80);
      lettering("15", x, 300, 210);
    }
  });
  return t;
}

function shortsTexture() {
  const c = document.createElement("canvas");
  c.width = 512;
  c.height = 128;
  const g = c.getContext("2d")!;
  g.fillStyle = CREAM;
  g.fillRect(0, 0, 512, 128);
  for (const x of [128, 384]) {
    g.fillStyle = "#790b13";
    g.fillRect(x - 12, 0, 24, 128);
    g.fillStyle = GOLD;
    g.fillRect(x - 18, 0, 5, 128);
    g.fillRect(x + 13, 0, 5, 128);
  }
  g.fillStyle = "#790b13";
  g.fillRect(0, 0, 512, 14);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** A mesh with the shared ink outline. */
function Part({ children, material, outline = 2, ...props }: { children: ReactNode; material: THREE.Material; outline?: number } & Omit<React.ComponentProps<"mesh">, "material" | "children">) {
  return (
    <mesh material={material} castShadow {...props}>
      {children}
      {outline > 0 && <Outlines thickness={outline} color={INK} />}
    </mesh>
  );
}

function Claws({ count = 3, length = 0.09, spread = 0.05, material }: { count?: number; length?: number; spread?: number; material: THREE.Material }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <Part key={i} material={material} outline={1.5} position={[(i - (count - 1) / 2) * spread, 0, length / 2]} rotation-x={Math.PI / 2}>
          <coneGeometry args={[0.022, length, 8]} />
        </Part>
      ))}
    </>
  );
}

function Teeth({ count, radius, y, z0, z1, up, material }: { count: number; radius: number; y: number; z0: number; z1: number; up: boolean; material: THREE.Material }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => {
        const k = i / (count - 1);
        const z = z0 + (z1 - z0) * k;
        const side = i % 2 === 0 ? -1 : 1;
        const x = side * radius * (1 - k * 0.55);
        return (
          <mesh key={i} material={material} position={[x, y, z]} rotation-x={up ? 0 : Math.PI}>
            <coneGeometry args={[0.02, 0.07, 6]} />
          </mesh>
        );
      })}
    </>
  );
}

export type RexProps = {
  /** Seconds (performance clock) of the last cheer; Rex jumps and roars for ~1.4 s after it. */
  cheerAt?: () => number;
  /** Follow the pointer with the head (stage only). */
  lookAtPointer?: boolean;
} & React.ComponentProps<"group">;

export default function Rex({ cheerAt, lookAtPointer = false, ...props }: RexProps) {
  const skin = useToon(SKIN);
  const skinDark = useToon(SKIN_DARK);
  const bone = useToon(BONE);
  const eye = useToon(EYE);
  const ink = useToon("#140406");
  const gold = useToon(GOLD);
  const tongue = useToon("#c2414f");
  const jerseyMap = useMemo(() => jerseyTexture(), []);
  const shortsMap = useMemo(() => shortsTexture(), []);
  const ballMap = useMemo(() => makeBallTexture(ballById("crimson")), []);
  const jersey = useToon("#ffffff", jerseyMap);
  const shorts = useToon("#ffffff", shortsMap);
  const ballMat = useToon("#ffffff", ballMap);
  const sneaker = useToon("#7a0f1a");
  useEffect(() => () => [jerseyMap, shortsMap, ballMap].forEach((t) => t.dispose()), [jerseyMap, shortsMap, ballMap]);

  const root = useRef<THREE.Group>(null);
  const torso = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const jaw = useRef<THREE.Group>(null);
  const eyes = useRef<THREE.Group>(null);
  const armL = useRef<THREE.Group>(null);
  const armR = useRef<THREE.Group>(null);
  const ball = useRef<THREE.Mesh>(null);
  const tail = useRef<(THREE.Group | null)[]>([]);
  const look = useMemo(() => new THREE.Vector2(), []);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const now = performance.now() / 1000;
    const since = cheerAt ? now - cheerAt() : 99;
    const cheering = since >= 0 && since < 1.4;
    const k = cheering ? Math.sin(Math.min(1, since / 1.4) * Math.PI) : 0;

    // dribble: hand pushes, ball drops to the floor and back every 0.62 s
    const p = (t % 0.62) / 0.62;
    const ballY = 0.14 + 0.66 * Math.abs(Math.cos(Math.PI * p));
    if (ball.current) {
      ball.current.position.y = cheering ? 0.14 + 0.66 + k * 1.2 : ballY;
      ball.current.rotation.x += 0.12;
    }
    if (armR.current) {
      armR.current.rotation.x = cheering ? -2.4 * k : -0.55 + 0.18 * Math.cos(2 * Math.PI * p);
    }
    if (armL.current) armL.current.rotation.x = cheering ? -2.6 * k : -0.25 + 0.05 * Math.sin(t * 2);

    // jump + roar
    if (root.current) root.current.position.y = cheering ? Math.max(0, Math.sin(Math.min(1, since / 0.7) * Math.PI)) * 0.45 : 0;
    if (jaw.current) jaw.current.rotation.x = 0.08 + (cheering ? 0.55 * k : 0.05 + 0.04 * Math.sin(t * 1.3));

    // breathing
    if (torso.current) torso.current.scale.y = 1 + 0.018 * Math.sin(t * 2.2);

    // tail sway, each segment lagging the last
    tail.current.forEach((seg, i) => {
      if (!seg) return;
      seg.rotation.y = 0.18 * Math.sin(t * 1.7 - i * 0.55) * (cheering ? 2 : 1);
      seg.rotation.x = -0.12 + 0.05 * Math.sin(t * 1.2 - i * 0.4);
    });

    // head: look toward the pointer on the stage, or scan the court
    if (head.current) {
      const tx = lookAtPointer ? state.pointer.x * 0.6 : 0.35 * Math.sin(t * 0.4);
      const ty = lookAtPointer ? state.pointer.y * 0.3 : 0.05;
      look.lerp(new THREE.Vector2(tx, ty), 0.08);
      head.current.rotation.y = look.x;
      head.current.rotation.x = -look.y - (cheering ? 0.4 * k : 0);
    }

    // blink every few seconds
    if (eyes.current) {
      const b = (t % 3.7) < 0.12;
      eyes.current.scale.y = b ? 0.12 : 1;
    }
  });

  const tailSegments = 7;

  return (
    <group {...props}>
      <group ref={root}>
        {/* legs + sneakers */}
        {[-1, 1].map((s) => (
          <group key={s} position={[s * 0.22, 0, 0]}>
            <RoundedBox args={[0.26, 0.17, 0.44]} radius={0.06} position={[0, 0.09, 0.06]} material={sneaker} castShadow>
              <Outlines thickness={2} color={INK} />
            </RoundedBox>
            <Part material={bone} outline={1.5} position={[0, 0.02, 0.06]}>
              <boxGeometry args={[0.28, 0.04, 0.46]} />
            </Part>
            <mesh material={gold} position={[0, 0.18, 0.08]}>
              <boxGeometry args={[0.12, 0.02, 0.2]} />
            </mesh>
            <group position={[0, 0.07, 0.28]}>
              <Claws material={bone} spread={0.07} length={0.1} />
            </group>
            <Part material={skin} position={[0, 0.4, 0.0]} rotation-x={-0.22}>
              <capsuleGeometry args={[0.1, 0.3, 6, 12]} />
            </Part>
            <Part material={skin} position={[0, 0.74, 0.08]} rotation-x={0.45}>
              <capsuleGeometry args={[0.15, 0.28, 6, 12]} />
            </Part>
          </group>
        ))}

        {/* shorts */}
        <Part material={shorts} position={[0, 0.94, 0.02]}>
          <cylinderGeometry args={[0.36, 0.44, 0.38, 24, 1]} />
        </Part>

        {/* tail */}
        <group position={[0, 0.98, -0.32]}>
          {(() => {
            // nested chain so every segment bends from the previous one
            let node: ReactNode = null;
            for (let i = tailSegments - 1; i >= 0; i--) {
              const r = 0.17 * (1 - i / (tailSegments + 1)) + 0.02;
              const child = node;
              node = (
                <group
                  key={i}
                  ref={(el) => {
                    tail.current[i] = el;
                  }}
                  position={i === 0 ? [0, 0, 0] : [0, 0.03, -0.24]}
                >
                  <Part material={i % 2 ? skin : skinDark} outline={1.5} rotation-x={Math.PI / 2} position={[0, 0, -0.12]}>
                    <capsuleGeometry args={[r, 0.14, 4, 10]} />
                  </Part>
                  {child}
                </group>
              );
            }
            return node;
          })()}
        </group>

        {/* torso in the jersey */}
        <group ref={torso} position={[0, 1.38, 0]}>
          <Part material={jersey} rotation-y={Math.PI / 2} scale={[1, 1, 0.8]}>
            <capsuleGeometry args={[0.39, 0.42, 8, 32]} />
          </Part>
          {/* shoulders */}
          {[-1, 1].map((s) => (
            <Part key={s} material={skin} position={[s * 0.42, 0.22, 0]}>
              <sphereGeometry args={[0.15, 16, 12]} />
            </Part>
          ))}
        </group>

        {/* arms: left free, right dribbling */}
        {[
          { s: -1, ref: armL },
          { s: 1, ref: armR },
        ].map(({ s, ref }) => (
          <group key={s} ref={ref} position={[s * 0.46, 1.6, 0.02]} rotation-z={s * 0.25}>
            <Part material={skin} position={[0, -0.2, 0]}>
              <capsuleGeometry args={[0.1, 0.26, 6, 12]} />
            </Part>
            <group position={[0, -0.42, 0]} rotation-x={-0.5}>
              <Part material={skin} position={[0, -0.16, 0]}>
                <capsuleGeometry args={[0.085, 0.24, 6, 12]} />
              </Part>
              <group position={[0, -0.36, 0.02]}>
                <Part material={skin}>
                  <sphereGeometry args={[0.1, 14, 10]} />
                </Part>
                <group position={[0, -0.04, 0.06]} rotation-x={0.7}>
                  <Claws material={bone} length={0.11} spread={0.055} />
                </group>
              </group>
            </group>
          </group>
        ))}

        {/* the ball, kept in front of the right hand */}
        <Part ref={ball} material={ballMat} position={[0.5, 0.6, 0.42]}>
          <sphereGeometry args={[0.13, 24, 16]} />
        </Part>

        {/* neck + head */}
        <Part material={skin} position={[0, 1.86, 0.06]} rotation-x={0.35}>
          <capsuleGeometry args={[0.16, 0.22, 6, 12]} />
        </Part>
        <group ref={head} position={[0, 2.08, 0.14]}>
          <Part material={skin} scale={[1, 0.9, 1.15]}>
            <sphereGeometry args={[0.26, 24, 18]} />
          </Part>
          {/* snout */}
          <Part material={skin} position={[0, -0.03, 0.3]} scale={[0.82, 0.62, 1.45]}>
            <sphereGeometry args={[0.2, 20, 14]} />
          </Part>
          {/* nostrils */}
          {[-1, 1].map((s) => (
            <mesh key={s} material={ink} position={[s * 0.06, 0.04, 0.56]}>
              <sphereGeometry args={[0.018, 8, 6]} />
            </mesh>
          ))}
          {/* brows */}
          {[-1, 1].map((s) => (
            <Part key={s} material={skinDark} outline={1.5} position={[s * 0.13, 0.17, 0.17]} rotation-z={s * -0.35} rotation-x={0.2}>
              <boxGeometry args={[0.16, 0.05, 0.1]} />
            </Part>
          ))}
          {/* eyes */}
          <group ref={eyes} position={[0, 0.09, 0.15]}>
            {[-1, 1].map((s) => (
              <group key={s} position={[s * 0.15, 0, 0]}>
                <Part material={eye} outline={1.5}>
                  <sphereGeometry args={[0.055, 14, 10]} />
                </Part>
                <mesh material={ink} position={[0, 0, 0.045]} scale={[0.5, 1.4, 0.5]}>
                  <sphereGeometry args={[0.025, 10, 8]} />
                </mesh>
              </group>
            ))}
          </group>
          {/* upper teeth */}
          <Teeth count={10} radius={0.13} y={-0.11} z0={0.12} z1={0.5} up={false} material={bone} />
          {/* lower jaw, hinged at the back */}
          <group ref={jaw} position={[0, -0.12, 0.02]}>
            <Part material={skin} position={[0, -0.04, 0.24]} scale={[0.76, 0.34, 1.35]}>
              <sphereGeometry args={[0.18, 18, 12]} />
            </Part>
            <mesh material={tongue} position={[0, -0.01, 0.22]} scale={[0.6, 0.2, 1]}>
              <sphereGeometry args={[0.12, 12, 8]} />
            </mesh>
            <Teeth count={8} radius={0.11} y={0.02} z0={0.1} z1={0.42} up material={bone} />
          </group>
        </group>
      </group>
    </group>
  );
}

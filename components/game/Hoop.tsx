"use client";

import { useMemo } from "react";
import { BallCollider, CuboidCollider, CylinderCollider, RigidBody } from "@react-three/rapier";
import { Outlines } from "@react-three/drei";
import {
  BASELINE_Z,
  BOARD_BOTTOM,
  BOARD_FRONT_Z,
  BOARD_H,
  BOARD_W,
  RIM_HEIGHT,
  RIM_RADIUS,
  RIM_TUBE,
} from "@/lib/court";
import { INK, toonGradient } from "@/lib/toon";
import { onScoreSensor } from "@/lib/shots";
import Net from "./Net";

const BOARD_D = 0.05;
const POLE_Z = BASELINE_Z - 1.1;
const ARM_Y = BOARD_BOTTOM + BOARD_H * 0.55;

export default function Hoop() {
  const gradient = toonGradient();
  const boardY = BOARD_BOTTOM + BOARD_H / 2;
  const boardZ = BOARD_FRONT_Z - BOARD_D / 2;

  const rimPoints = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => {
        const a = (i / 18) * Math.PI * 2;
        return [Math.cos(a) * RIM_RADIUS, RIM_HEIGHT, Math.sin(a) * RIM_RADIUS] as [number, number, number];
      }),
    [],
  );

  // inner target square on the board
  const sqW = 0.59;
  const sqH = 0.45;
  const sqBottom = RIM_HEIGHT + 0.15;
  const strip = 0.05;

  return (
    <group>
      {/* stanchion, arm and backboard */}
      <RigidBody type="fixed" name="board" colliders={false} restitution={0.65} friction={0.4}>
        <CuboidCollider args={[BOARD_W / 2, BOARD_H / 2, BOARD_D / 2]} position={[0, boardY, boardZ]} />
        <CuboidCollider args={[0.14, ARM_Y / 2, 0.14]} position={[0, ARM_Y / 2, POLE_Z]} />

        <mesh position={[0, 0.35, POLE_Z]} castShadow receiveShadow>
          <boxGeometry args={[1.1, 0.7, 1.6]} />
          <meshToonMaterial color="#2b0a0e" gradientMap={gradient} />
          <Outlines thickness={2.5} color={INK} />
        </mesh>
        <mesh position={[0, ARM_Y / 2, POLE_Z]} castShadow>
          <boxGeometry args={[0.24, ARM_Y, 0.24]} />
          <meshToonMaterial color="#4a1a1e" gradientMap={gradient} />
          <Outlines thickness={2.5} color={INK} />
        </mesh>
        <mesh position={[0, ARM_Y, (POLE_Z + boardZ) / 2]} castShadow>
          <boxGeometry args={[0.18, 0.18, boardZ - POLE_Z]} />
          <meshToonMaterial color="#4a1a1e" gradientMap={gradient} />
          <Outlines thickness={2.5} color={INK} />
        </mesh>
        {/* padding at the base of the pole */}
        <mesh position={[0, 1.1, POLE_Z + 0.16]}>
          <boxGeometry args={[0.32, 1.4, 0.08]} />
          <meshToonMaterial color="#790b13" gradientMap={gradient} />
        </mesh>

        {/* glass board */}
        <mesh position={[0, boardY, boardZ]} castShadow>
          <boxGeometry args={[BOARD_W, BOARD_H, BOARD_D]} />
          <meshToonMaterial color="#cfe6f5" gradientMap={gradient} transparent opacity={0.45} depthWrite={false} />
          <Outlines thickness={3} color={INK} />
        </mesh>
        {/* board frame + target square */}
        {[
          [0, BOARD_BOTTOM + BOARD_H - 0.035, BOARD_W, 0.07],
          [0, BOARD_BOTTOM + 0.035, BOARD_W, 0.07],
          [-BOARD_W / 2 + 0.035, boardY, 0.07, BOARD_H],
          [BOARD_W / 2 - 0.035, boardY, 0.07, BOARD_H],
          [0, sqBottom + strip / 2, sqW, strip],
          [0, sqBottom + sqH - strip / 2, sqW, strip],
          [-sqW / 2 + strip / 2, sqBottom + sqH / 2, strip, sqH],
          [sqW / 2 - strip / 2, sqBottom + sqH / 2, strip, sqH],
        ].map(([x, y, w, h], i) => (
          <mesh key={i} position={[x, y, BOARD_FRONT_Z + 0.004]}>
            <planeGeometry args={[w, h]} />
            <meshToonMaterial color={i < 4 ? "#fff0dc" : "#790b13"} gradientMap={gradient} />
          </mesh>
        ))}
      </RigidBody>

      {/* rim: a ring of small spheres gives believable rim bounces */}
      <RigidBody type="fixed" name="rim" colliders={false} restitution={0.55} friction={0.3}>
        {rimPoints.map((p, i) => (
          <BallCollider key={i} args={[RIM_TUBE + 0.006]} position={p} />
        ))}
        {/* bracket joining rim to board */}
        <CuboidCollider
          args={[0.06, 0.02, (-RIM_RADIUS - BOARD_FRONT_Z) / 2]}
          position={[0, RIM_HEIGHT - 0.01, (BOARD_FRONT_Z - RIM_RADIUS) / 2]}
        />
        {/* scoring sensor just below the rim */}
        <CylinderCollider
          sensor
          args={[0.03, RIM_RADIUS - 0.07]}
          position={[0, RIM_HEIGHT - 0.16, 0]}
          onIntersectionEnter={(e) => {
            if (e.other.rigidBodyObject?.name === "ball") onScoreSensor();
          }}
        />

        <mesh position={[0, RIM_HEIGHT, 0]} rotation-x={Math.PI / 2} castShadow>
          <torusGeometry args={[RIM_RADIUS, RIM_TUBE, 10, 40]} />
          <meshToonMaterial color="#f2711c" gradientMap={gradient} />
          <Outlines thickness={1.5} color={INK} />
        </mesh>
        <mesh position={[0, RIM_HEIGHT - 0.01, (BOARD_FRONT_Z - RIM_RADIUS) / 2]}>
          <boxGeometry args={[0.12, 0.04, -RIM_RADIUS - BOARD_FRONT_Z]} />
          <meshToonMaterial color="#f2711c" gradientMap={gradient} />
          <Outlines thickness={1.5} color={INK} />
        </mesh>
      </RigidBody>

      <Net />
    </group>
  );
}

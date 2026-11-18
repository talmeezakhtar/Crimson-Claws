"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { CuboidCollider, RigidBody } from "@react-three/rapier";
import {
  BASELINE_Z,
  COURT_L,
  COURT_W,
  FT_LINE_Z,
  KEY_W,
  THREE_PT_RADIUS,
  THREE_PT_SIDE_X,
} from "@/lib/court";
import { displayFont, drawWithFonts, toonGradient } from "@/lib/toon";

const PX = 136; // canvas pixels per metre

/** Paint the hardwood, key, arcs and logo onto a canvas. */
function makeCourtTexture() {
  const w = Math.round(COURT_W * PX);
  const h = Math.round(COURT_L * PX);
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d")!;
  const tex = new THREE.CanvasTexture(c);
  drawWithFonts(tex, () => paint(g, w, h));
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

function paint(g: CanvasRenderingContext2D, w: number, h: number) {
  // hardwood planks running along the court
  const plank = 0.12 * PX;
  const rand = mulberry(7);
  for (let x = 0; x < w; x += plank) {
    let y = -rand() * 3 * PX;
    while (y < h) {
      const len = (1.6 + rand() * 2.4) * PX;
      const l = 62 + rand() * 8;
      g.fillStyle = `hsl(${30 + rand() * 4}, ${55 + rand() * 10}%, ${l}%)`;
      g.fillRect(x, y, plank, len);
      g.fillStyle = "rgba(90,50,20,0.25)";
      g.fillRect(x, y, 1.5, len);
      g.fillRect(x, y, plank, 1.5);
      y += len;
    }
  }

  const X = (m: number) => (m + COURT_W / 2) * PX; // world x → px
  const Y = (z: number) => (z - BASELINE_Z) * PX; // world z → px
  const R = (m: number) => m * PX;
  const lw = 0.06 * PX;

  // painted key + three-point area tint
  g.fillStyle = "rgba(121, 11, 19, 0.9)";
  g.fillRect(X(-KEY_W / 2), Y(BASELINE_Z), R(KEY_W), Y(FT_LINE_Z));

  g.strokeStyle = "#fff0dc";
  g.lineWidth = lw;
  g.lineCap = "butt";

  // boundary + half-court line
  g.strokeRect(lw / 2, lw / 2, w - lw, h - lw / 2 + lw);

  // key
  g.strokeRect(X(-KEY_W / 2), Y(BASELINE_Z), R(KEY_W), Y(FT_LINE_Z));

  // free-throw circle (solid top half, dashed lower half)
  g.beginPath();
  g.arc(X(0), Y(FT_LINE_Z), R(1.8), 0, Math.PI);
  g.stroke();
  g.setLineDash([R(0.35), R(0.3)]);
  g.beginPath();
  g.arc(X(0), Y(FT_LINE_Z), R(1.8), Math.PI, Math.PI * 2);
  g.stroke();
  g.setLineDash([]);

  // restricted-area arc
  g.beginPath();
  g.arc(X(0), Y(0), R(1.25), 0, Math.PI);
  g.stroke();

  // three-point line
  const cornerZ = Math.sqrt(THREE_PT_RADIUS ** 2 - THREE_PT_SIDE_X ** 2);
  const a = Math.atan2(cornerZ, THREE_PT_SIDE_X);
  g.beginPath();
  g.moveTo(X(-THREE_PT_SIDE_X), Y(BASELINE_Z));
  g.lineTo(X(-THREE_PT_SIDE_X), Y(cornerZ));
  g.arc(X(0), Y(0), R(THREE_PT_RADIUS), Math.PI - a, a, true);
  g.lineTo(X(THREE_PT_SIDE_X), Y(BASELINE_Z));
  g.stroke();

  // centre circle (half of it is on this half court)
  g.fillStyle = "rgba(121, 11, 19, 0.92)";
  g.beginPath();
  g.arc(X(0), h, R(1.8), Math.PI, Math.PI * 2);
  g.fill();
  g.stroke();

  // logo text near half court
  g.font = displayFont(R(0.62), 650);
  g.textAlign = "center";
  g.fillStyle = "rgba(43, 10, 14, 0.88)";
  g.fillText("CRIMSON CLAWS", X(0), h - R(0.42));
}

function mulberry(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function Court() {
  const texture = useMemo(() => makeCourtTexture(), []);
  const gradient = toonGradient();
  const centerZ = BASELINE_Z + COURT_L / 2;

  return (
    <RigidBody type="fixed" name="floor" colliders={false} friction={0.8} restitution={0.8}>
      <CuboidCollider args={[40, 0.5, 40]} position={[0, -0.5, 8]} />

      {/* hardwood court */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0.002, centerZ]} receiveShadow>
        <planeGeometry args={[COURT_W, COURT_L]} />
        <meshToonMaterial map={texture} gradientMap={gradient} />
      </mesh>

      {/* apron around the court */}
      <mesh rotation-x={-Math.PI / 2} position={[0, 0, centerZ + 2]} receiveShadow>
        <planeGeometry args={[COURT_W + 6, COURT_L + 10]} />
        <meshToonMaterial color="#5c070e" gradientMap={gradient} />
      </mesh>
    </RigidBody>
  );
}

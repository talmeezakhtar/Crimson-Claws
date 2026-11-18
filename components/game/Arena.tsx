"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { Outlines } from "@react-three/drei";
import { net } from "@/lib/runtime";
import { registerGlow } from "@/lib/materials";
import { INK, displayFont, drawWithFonts, toonGradient } from "@/lib/toon";

// ---- shared, lerped by the LightRig ----
export const skyUniforms = {
  top: { value: new THREE.Color("#4f9be0") },
  bottom: { value: new THREE.Color("#cfe7f6") },
};
export const starMaterial = new THREE.PointsMaterial({
  color: "#ffffff",
  size: 1.6,
  sizeAttenuation: false,
  transparent: true,
  opacity: 0,
  depthWrite: false,
  fog: false,
});

export const TOWERS: [number, number, number][] = [
  [-13.5, 17, -6],
  [13.5, 17, -6],
  [-13.5, 17, 16],
  [13.5, 17, 16],
];

function Sky() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        fog: false,
        uniforms: skyUniforms,
        vertexShader: `varying vec3 vPos; void main(){ vPos = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
        fragmentShader: `uniform vec3 top; uniform vec3 bottom; varying vec3 vPos;
          void main(){ float h = clamp(normalize(vPos).y * 1.6 + 0.1, 0.0, 1.0); gl_FragColor = vec4(mix(bottom, top, h), 1.0); }`,
      }),
    [],
  );
  const stars = useMemo(() => {
    const g = new THREE.BufferGeometry();
    const pts: number[] = [];
    const rand = mulberry(5);
    for (let i = 0; i < 700; i++) {
      const u = rand() * Math.PI * 2;
      const v = 0.15 + rand() * 0.85;
      const r = 160;
      pts.push(Math.cos(u) * Math.sqrt(1 - v * v) * r, v * r, Math.sin(u) * Math.sqrt(1 - v * v) * r);
    }
    g.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return g;
  }, []);
  return (
    <>
      <mesh material={material} renderOrder={-1}>
        <sphereGeometry args={[180, 32, 16]} />
      </mesh>
      <points geometry={stars} material={starMaterial} />
    </>
  );
}

function bannerTexture(text: string, sub: string, w = 1024, h = 256) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  const g = c.getContext("2d")!;
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  drawWithFonts(t, () => paintBanner(g, text, sub, w, h));
  return t;
}

function paintBanner(g: CanvasRenderingContext2D, text: string, sub: string, w: number, h: number) {
  g.fillStyle = "#790b13";
  g.fillRect(0, 0, w, h);
  g.fillStyle = "#fff0dc";
  g.fillRect(0, h - 22, w, 22);
  g.fillRect(0, 0, w, 10);
  g.font = displayFont(h * 0.36, 650);
  g.textAlign = "center";
  g.textBaseline = "middle";
  g.fillStyle = "#fff0dc";
  g.fillText(text, w / 2, h * 0.42);
  g.font = displayFont(h * 0.13, 500);
  g.fillStyle = "#f3d9bd";
  g.fillText(sub, w / 2, h * 0.75);
}

function Banner({ text, sub, position, rotationY = 0, width = 8 }: {
  text: string;
  sub: string;
  position: [number, number, number];
  rotationY?: number;
  width?: number;
}) {
  const material = useMemo(() => {
    const map = bannerTexture(text, sub);
    return registerGlow(
      new THREE.MeshToonMaterial({ map, emissive: "#ffffff", emissiveMap: map, emissiveIntensity: 0.2, gradientMap: toonGradient() }),
    );
  }, [text, sub]);
  return (
    <mesh position={position} rotation-y={rotationY} material={material}>
      <planeGeometry args={[width, width / 4]} />
    </mesh>
  );
}

const SHIRTS = ["#790b13", "#fff0dc", "#5c070e", "#a3121d", "#e8d3ba", "#2b0a0e", "#790b13"];
const SKIN = ["#f1c7a5", "#d9a07a", "#a86b45", "#7a4a2e", "#5a3622", "#e8b48f"];

type Seat = { x: number; y: number; z: number; ry: number };

/** Stepped stands on three sides of the court, filled with a blocky crowd. */
function Stands() {
  const gradient = toonGradient();
  const rows = 6;
  const step = 0.9;
  const rise = 0.55;

  const { steps, seats } = useMemo(() => {
    const steps: { pos: [number, number, number]; size: [number, number, number]; color: string }[] = [];
    const seats: Seat[] = [];
    for (let i = 0; i < rows; i++) {
      const h = (i + 1) * rise;
      const color = i % 2 ? "#3a1418" : "#4a1a1e";
      // left / right
      for (const side of [-1, 1]) {
        const x = side * (11.2 + i * step);
        steps.push({ pos: [x, h / 2, 6], size: [step, h, 21], color });
        for (let z = -3.8; z <= 16.2; z += 0.62) seats.push({ x, y: h, z, ry: side * -Math.PI / 2 });
      }
      // behind the baseline
      const z = -5.2 - i * step;
      steps.push({ pos: [0, h / 2, z], size: [21.3 + i * step * 2, h, step], color });
      for (let x = -10.4; x <= 10.4; x += 0.62) seats.push({ x, y: h, z, ry: 0 });
    }
    const rand = mulberry(11);
    return { steps, seats: seats.filter(() => rand() > 0.14) };
  }, []);

  const bodies = useRef<THREE.InstancedMesh>(null);
  const heads = useRef<THREE.InstancedMesh>(null);
  const phases = useMemo(() => {
    const rand = mulberry(9);
    return seats.map(() => rand() * Math.PI * 2);
  }, [seats]);

  useLayoutEffect(() => {
    const b = bodies.current;
    const hd = heads.current;
    if (!b || !hd) return;
    const m = new THREE.Matrix4();
    const c = new THREE.Color();
    const rand = mulberry(3);
    seats.forEach((s, i) => {
      m.makeRotationY(s.ry).setPosition(s.x, s.y + 0.36, s.z);
      b.setMatrixAt(i, m);
      b.setColorAt(i, c.set(SHIRTS[Math.floor(rand() * SHIRTS.length)]));
      m.makeTranslation(s.x, s.y + 0.86, s.z);
      hd.setMatrixAt(i, m);
      hd.setColorAt(i, c.set(SKIN[Math.floor(rand() * SKIN.length)]));
    });
    b.instanceMatrix.needsUpdate = true;
    hd.instanceMatrix.needsUpdate = true;
    if (b.instanceColor) b.instanceColor.needsUpdate = true;
    if (hd.instanceColor) hd.instanceColor.needsUpdate = true;
  }, [seats]);

  // the crowd jumps for a second after every make
  const m = useMemo(() => new THREE.Matrix4(), []);
  const wasCheering = useRef(false);
  useFrame(() => {
    const since = performance.now() / 1000 - net.kickAt;
    const cheering = since >= 0 && since < 1.6;
    if (!cheering && !wasCheering.current) return;
    wasCheering.current = cheering;
    const b = bodies.current!;
    const hd = heads.current!;
    const fade = cheering ? 1 - since / 1.6 : 0;
    seats.forEach((s, i) => {
      const jump = Math.max(0, Math.sin(since * 11 + phases[i])) * 0.22 * fade;
      m.makeRotationY(s.ry).setPosition(s.x, s.y + 0.36 + jump, s.z);
      b.setMatrixAt(i, m);
      m.makeTranslation(s.x, s.y + 0.86 + jump, s.z);
      hd.setMatrixAt(i, m);
    });
    b.instanceMatrix.needsUpdate = true;
    hd.instanceMatrix.needsUpdate = true;
  });

  return (
    <group>
      {steps.map((s, i) => (
        <mesh key={i} position={s.pos} castShadow receiveShadow>
          <boxGeometry args={s.size} />
          <meshToonMaterial color={s.color} gradientMap={gradient} />
        </mesh>
      ))}
      <instancedMesh ref={bodies} args={[undefined, undefined, seats.length]} castShadow>
        <boxGeometry args={[0.42, 0.62, 0.3]} />
        <meshToonMaterial gradientMap={gradient} />
      </instancedMesh>
      <instancedMesh ref={heads} args={[undefined, undefined, seats.length]}>
        <sphereGeometry args={[0.15, 10, 8]} />
        <meshToonMaterial gradientMap={gradient} />
      </instancedMesh>
    </group>
  );
}

function LightTowers() {
  const gradient = toonGradient();
  const lampMaterial = useMemo(
    () => registerGlow(new THREE.MeshToonMaterial({ color: "#2b3446", emissive: "#fff2c8", emissiveIntensity: 0.2, gradientMap: gradient })),
    [gradient],
  );
  return (
    <group>
      {TOWERS.map(([x, y, z], i) => {
        const facing = Math.atan2(-x, 4 - z);
        return (
          <group key={i} position={[x, 0, z]}>
            <mesh position={[0, y / 2, 0]} castShadow>
              <cylinderGeometry args={[0.18, 0.28, y, 8]} />
              <meshToonMaterial color="#4a1a1e" gradientMap={gradient} />
              <Outlines thickness={2} color={INK} />
            </mesh>
            <group position={[0, y + 0.6, 0]} rotation-y={facing} rotation-x={0}>
              <mesh>
                <boxGeometry args={[2.6, 1.6, 0.35]} />
                <meshToonMaterial color="#2b0a0e" gradientMap={gradient} />
                <Outlines thickness={2} color={INK} />
              </mesh>
              {[-0.85, 0, 0.85].flatMap((lx) =>
                [-0.4, 0.4].map((ly) => (
                  <mesh key={`${lx}${ly}`} position={[lx, ly, 0.18]} material={lampMaterial}>
                    <circleGeometry args={[0.3, 16]} />
                  </mesh>
                )),
              )}
            </group>
          </group>
        );
      })}
    </group>
  );
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

export default function Arena() {
  return (
    <group>
      <Sky />
      <Stands />
      <LightTowers />
      {/* back wall behind the baseline stands */}
      <mesh position={[0, 2.6, -11.1]} receiveShadow>
        <boxGeometry args={[30, 5.2, 0.4]} />
        <meshToonMaterial color="#2b0a0e" gradientMap={toonGradient()} />
      </mesh>
      <Banner text="Home of the Claws" sub="THE KILN  ·  REDMERE  ·  SINCE 1988" position={[0, 6.6, -11.3]} width={12} />
      <Banner text="Crimson Claws" sub="DEFEND THE KILN" position={[-17.4, 6.4, 5]} rotationY={Math.PI / 2} width={9} />
      <Banner text="Crimson Claws" sub="DEFEND THE KILN" position={[17.4, 6.4, 5]} rotationY={-Math.PI / 2} width={9} />
      {/* banner backing walls on the sides */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 17.6, 3.6, 5]}>
          <boxGeometry args={[0.3, 7.2, 22]} />
          <meshToonMaterial color="#2b0a0e" gradientMap={toonGradient()} />
        </mesh>
      ))}
    </group>
  );
}

"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { LineSegments2 } from "three/examples/jsm/lines/LineSegments2.js";
import { LineSegmentsGeometry } from "three/examples/jsm/lines/LineSegmentsGeometry.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import { net } from "@/lib/runtime";
import { RIM_HEIGHT, RIM_RADIUS } from "@/lib/court";

const STRANDS = 12;
const LEVELS = [
  { r: RIM_RADIUS, y: 0 },
  { r: 0.205, y: -0.13 },
  { r: 0.175, y: -0.26 },
  { r: 0.15, y: -0.38 },
  { r: 0.14, y: -0.46 },
];

/** Diamond-pattern net made of thick line segments that sway when the ball goes through. */
export default function Net() {
  const size = useThree((s) => s.size);

  const { line, positions } = useMemo(() => {
    const segCount = (LEVELS.length - 1) * STRANDS * 2;
    const positions = new Float32Array(segCount * 6);
    const geometry = new LineSegmentsGeometry();
    const material = new LineMaterial({ color: 0xf6efe4, linewidth: 2.2, transparent: true, opacity: 0.95 });
    const line = new LineSegments2(geometry, material);
    line.position.set(0, RIM_HEIGHT, 0);
    return { line, positions };
  }, []);

  useEffect(() => {
    (line.material as LineMaterial).resolution.set(size.width, size.height);
  }, [line, size]);

  useEffect(
    () => () => {
      line.geometry.dispose();
      (line.material as LineMaterial).dispose();
    },
    [line],
  );

  const settled = useRef(false);

  useFrame(() => {
    const t = performance.now() / 1000;
    const since = t - net.kickAt;
    const amp = since >= 0 ? Math.exp(-since * 3.2) * net.strength : 0;
    if (amp < 0.002 && settled.current) return;
    settled.current = amp < 0.002;

    let k = 0;
    const point = (level: number, j: number) => {
      const L = LEVELS[level];
      const depth = level / (LEVELS.length - 1);
      const wobble = amp * Math.sin(since * 16 - level * 1.2);
      const r = L.r * (1 + 0.22 * wobble * depth);
      const y = L.y * (1 + 0.35 * amp * depth) - 0.06 * amp * depth;
      const a = ((j + (level % 2) * 0.5) / STRANDS) * Math.PI * 2;
      const sway = 0.04 * amp * depth * Math.sin(since * 9);
      return [Math.cos(a) * r + sway, y, Math.sin(a) * r];
    };
    for (let i = 0; i < LEVELS.length - 1; i++) {
      for (let j = 0; j < STRANDS; j++) {
        const p = point(i, j);
        const off = i % 2 === 0 ? -1 : 1;
        const q1 = point(i + 1, j);
        const q2 = point(i + 1, (j + off + STRANDS) % STRANDS);
        positions.set([...p, ...q1, ...p, ...q2], k);
        k += 12;
      }
    }
    line.geometry.setPositions(positions);
  });

  return <primitive object={line} />;
}

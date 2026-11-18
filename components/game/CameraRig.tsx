"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { RIM_HEIGHT, RELEASE_HEIGHT, SPOTS } from "@/lib/court";
import { useGame } from "@/lib/store";

/** Eases the camera between the shooter, broadcast and top views (or orbits in showcase mode). */
export default function CameraRig({ showcase = false }: { showcase?: boolean }) {
  const look = useMemo(() => new THREE.Vector3(0, 2.4, 3), []);
  const goalPos = useMemo(() => new THREE.Vector3(), []);
  const goalLook = useMemo(() => new THREE.Vector3(), []);

  useFrame(({ camera, clock }, dt) => {
    const k = 1 - Math.exp(-Math.min(dt, 0.1) * (showcase ? 1.5 : 2.6));

    if (showcase) {
      const a = clock.elapsedTime * 0.07 + 0.6;
      goalPos.set(Math.sin(a) * 12.5, 5.2, 3 + Math.cos(a) * 12.5);
      goalLook.set(0, 2.2, 2.2);
    } else {
      const { camera: view, spotIndex } = useGame.getState();
      const spot = SPOTS[spotIndex % SPOTS.length];
      if (view === "shooter") {
        const away = new THREE.Vector3(spot.x, 0, spot.z).normalize();
        const dist = Math.hypot(spot.x, spot.z);
        goalPos.set(spot.x, 0, spot.z).addScaledVector(away, 2.4 + dist * 0.06);
        goalPos.y = 2.6 + dist * 0.05;
        goalLook.set(spot.x * 0.4, (RELEASE_HEIGHT + RIM_HEIGHT) / 2 + 0.35, spot.z * 0.4);
      } else if (view === "broadcast") {
        goalPos.set(12.5, 7.5, 10);
        goalLook.set(0, 2, 2.5);
      } else {
        goalPos.set(0, 19, 8.5);
        goalLook.set(0, 0, 3.6);
      }
    }

    camera.position.lerp(goalPos, k);
    look.lerp(goalLook, k);
    camera.lookAt(look);
  });

  return null;
}

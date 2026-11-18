"use client";

import { Suspense, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, OrbitControls } from "@react-three/drei";
import { sfx, unlockAudio } from "@/lib/audio";
import Rex from "./Rex";

/** Interactive stage: drag to turn Rex around, click him to make him roar and jump. */
export default function MascotStage() {
  const cheer = useRef(-10);
  return (
    <Canvas
      shadows="percentage"
      flat
      dpr={[1, 2]}
      camera={{ position: [1.1, 1.55, 4.1], fov: 34 }}
      gl={{ antialias: true, alpha: true }}
      style={{ touchAction: "pan-y" }}
    >
      <Suspense fallback={null}>
        <hemisphereLight args={["#fff4e6", "#5c070e", 1.3]} />
        <directionalLight position={[3, 6, 4]} intensity={2.2} castShadow shadow-mapSize={[1024, 1024]} />
        <directionalLight position={[-4, 3, -3]} intensity={0.8} color="#ffb59a" />
        <Rex
          position={[0, 0, 0]}
          lookAtPointer
          cheerAt={() => cheer.current}
          onClick={(e) => {
            e.stopPropagation();
            unlockAudio();
            cheer.current = performance.now() / 1000;
            sfx.roar();
          }}
          onPointerOver={() => (document.body.style.cursor = "pointer")}
          onPointerOut={() => (document.body.style.cursor = "")}
        />
        <ContactShadows position={[0, 0.001, 0]} opacity={0.55} scale={6} blur={2.4} far={3} color="#2b0a0e" />
        <OrbitControls
          target={[0, 1.15, 0]}
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 2.05}
          autoRotate
          autoRotateSpeed={0.6}
        />
      </Suspense>
    </Canvas>
  );
}

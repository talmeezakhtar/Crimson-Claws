"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { LIGHTING } from "@/lib/lighting";
import { glowMaterials } from "@/lib/materials";
import { useGame } from "@/lib/store";
import { skyUniforms, starMaterial, TOWERS } from "./Arena";

const COURT_TARGET = new THREE.Vector3(0, 0, 4);

/**
 * Hemisphere + sun + four stadium spotlights. When the time-of-day preset changes,
 * every colour and intensity eases toward the new preset over ~1.5 s.
 */
export default function LightRig({ lowPower = false }: { lowPower?: boolean }) {
  const hemi = useRef<THREE.HemisphereLight>(null);
  const sun = useRef<THREE.DirectionalLight>(null);
  const spots = useRef<(THREE.SpotLight | null)[]>([]);
  const scene = useThree((s) => s.scene);
  const lighting = useGame((s) => s.lighting);

  // current (animated) values, starting at the preset we mount with
  const cur = useMemo(() => {
    const p = LIGHTING[useGame.getState().lighting];
    return {
      skyTop: new THREE.Color(p.skyTop),
      skyBottom: new THREE.Color(p.skyBottom),
      fog: new THREE.Color(p.fog),
      fogNear: p.fogNear,
      fogFar: p.fogFar,
      hemiSky: new THREE.Color(p.hemiSky),
      hemiGround: new THREE.Color(p.hemiGround),
      hemiIntensity: p.hemiIntensity,
      sunColor: new THREE.Color(p.sunColor),
      sunIntensity: p.sunIntensity,
      sunPosition: new THREE.Vector3(...p.sunPosition),
      spotIntensity: p.spotIntensity,
      emissive: p.emissive,
      stars: p.stars,
    };
  }, []);

  const target = useMemo(() => {
    const p = LIGHTING[lighting];
    return {
      skyTop: new THREE.Color(p.skyTop),
      skyBottom: new THREE.Color(p.skyBottom),
      fog: new THREE.Color(p.fog),
      hemiSky: new THREE.Color(p.hemiSky),
      hemiGround: new THREE.Color(p.hemiGround),
      sunColor: new THREE.Color(p.sunColor),
      sunPosition: new THREE.Vector3(...p.sunPosition),
      p,
    };
  }, [lighting]);

  useEffect(() => {
    scene.fog = new THREE.Fog(cur.fog, cur.fogNear, cur.fogFar);
    return () => {
      scene.fog = null;
    };
  }, [scene, cur]);

  useEffect(() => {
    const s = sun.current;
    if (!s) return;
    s.target.position.copy(COURT_TARGET);
    scene.add(s.target);
    spots.current.forEach((sp) => {
      if (!sp) return;
      sp.target.position.copy(COURT_TARGET);
      scene.add(sp.target);
    });
  }, [scene]);

  useFrame((_, dt) => {
    const k = 1 - Math.exp(-Math.min(dt, 0.1) * 3);
    const lerp = (a: number, b: number) => a + (b - a) * k;
    const p = target.p;

    cur.skyTop.lerp(target.skyTop, k);
    cur.skyBottom.lerp(target.skyBottom, k);
    cur.fog.lerp(target.fog, k);
    cur.fogNear = lerp(cur.fogNear, p.fogNear);
    cur.fogFar = lerp(cur.fogFar, p.fogFar);
    cur.hemiSky.lerp(target.hemiSky, k);
    cur.hemiGround.lerp(target.hemiGround, k);
    cur.hemiIntensity = lerp(cur.hemiIntensity, p.hemiIntensity);
    cur.sunColor.lerp(target.sunColor, k);
    cur.sunIntensity = lerp(cur.sunIntensity, p.sunIntensity);
    cur.sunPosition.lerp(target.sunPosition, k);
    cur.spotIntensity = lerp(cur.spotIntensity, p.spotIntensity);
    cur.emissive = lerp(cur.emissive, p.emissive);
    cur.stars = lerp(cur.stars, p.stars);

    skyUniforms.top.value.copy(cur.skyTop);
    skyUniforms.bottom.value.copy(cur.skyBottom);
    starMaterial.opacity = cur.stars;
    if (scene.fog instanceof THREE.Fog) {
      scene.fog.color.copy(cur.fog);
      scene.fog.near = cur.fogNear;
      scene.fog.far = cur.fogFar;
    }
    if (hemi.current) {
      hemi.current.color.copy(cur.hemiSky);
      hemi.current.groundColor.copy(cur.hemiGround);
      hemi.current.intensity = cur.hemiIntensity;
    }
    if (sun.current) {
      sun.current.color.copy(cur.sunColor);
      sun.current.intensity = cur.sunIntensity;
      sun.current.position.copy(COURT_TARGET).add(cur.sunPosition);
    }
    spots.current.forEach((sp) => sp && (sp.intensity = cur.spotIntensity));
    glowMaterials.forEach((m) => {
      if ("emissiveIntensity" in m) m.emissiveIntensity = cur.emissive;
    });
  });

  const mapSize = lowPower ? 1024 : 2048;

  return (
    <>
      <hemisphereLight ref={hemi} />
      <directionalLight
        ref={sun}
        castShadow
        shadow-mapSize={[mapSize, mapSize]}
        shadow-bias={-0.0004}
        shadow-normalBias={0.02}
        shadow-camera-left={-22}
        shadow-camera-right={22}
        shadow-camera-top={22}
        shadow-camera-bottom={-22}
        shadow-camera-near={1}
        shadow-camera-far={90}
      />
      {TOWERS.map(([x, y, z], i) => (
        <spotLight
          key={i}
          ref={(el) => {
            spots.current[i] = el;
          }}
          position={[x, y + 0.6, z]}
          color="#fff1d0"
          angle={0.55}
          penumbra={0.7}
          decay={0}
          distance={0}
          intensity={0}
        />
      ))}
    </>
  );
}

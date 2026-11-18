import * as THREE from "three";

/**
 * Materials that glow at night (banners, lamp heads, scoreboard).
 * The light rig changes their emissiveIntensity when the time of day changes.
 */
export const glowMaterials = new Set<THREE.MeshToonMaterial | THREE.MeshBasicMaterial>();

export function registerGlow<T extends THREE.MeshToonMaterial>(m: T) {
  glowMaterials.add(m);
  return m;
}

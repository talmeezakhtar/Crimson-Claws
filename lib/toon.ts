import * as THREE from "three";

let gradient: THREE.DataTexture | null = null;

/** 3-step gradient that gives MeshToonMaterial its flat cel-shaded bands. */
export function toonGradient() {
  if (gradient) return gradient;
  const steps = new Uint8Array([90, 170, 255]);
  const data = new Uint8Array(steps.length * 4);
  steps.forEach((v, i) => data.set([v, v, v, 255], i * 4));
  gradient = new THREE.DataTexture(data, steps.length, 1, THREE.RGBAFormat);
  gradient.minFilter = THREE.NearestFilter;
  gradient.magFilter = THREE.NearestFilter;
  gradient.generateMipmaps = false;
  gradient.needsUpdate = true;
  return gradient;
}

export const INK = "#0d1018";

/** Canvas font string in the site's blackletter display face (next/font hashes the family name). */
export function displayFont(px: number, weight = 400) {
  const family = getComputedStyle(document.documentElement).getPropertyValue("--font-jacquard").trim() || "serif";
  return `${weight} ${Math.round(px)}px ${family}`;
}

/** Draw now, then again once web fonts have loaded so canvas text uses the brand face. */
export function drawWithFonts(texture: { needsUpdate: boolean }, draw: () => void) {
  draw();
  document.fonts?.ready.then(() => {
    draw();
    texture.needsUpdate = true;
  });
}

import * as THREE from "three";
import { RELEASE_HEIGHT, RIM_HEIGHT } from "./court";

export const GRAVITY = 9.81;
const LAUNCH_ANGLE = THREE.MathUtils.degToRad(52);
const MAX_YAW = 0.32; // radians of left/right aim at full sideways drag

/** Drag length (px) that counts as full power, scaled to the screen. */
export function dragScale() {
  if (typeof window === "undefined") return 360;
  return Math.max(200, Math.min(window.innerHeight * 0.42, 380));
}

/** Speed needed to drop the ball through the rim centre from `from` at the launch angle. */
function idealSpeed(horizontalDist: number, heightDiff: number) {
  const cos = Math.cos(LAUNCH_ANGLE);
  const denom = 2 * cos * cos * (horizontalDist * Math.tan(LAUNCH_ANGLE) - heightDiff);
  if (denom <= 0.01) return 7;
  return Math.sqrt((GRAVITY * horizontalDist * horizontalDist) / denom);
}

/**
 * Turn a drag (screen pixels, dy negative = upward flick) into a launch velocity.
 * Drag length sets power: about 60% of the full drag is the "perfect" shot.
 * Sideways drag turns the aim left/right.
 */
export function flickToVelocity(
  from: THREE.Vector3,
  dx: number,
  dy: number,
  out = new THREE.Vector3(),
) {
  const scale = dragScale();
  const power = THREE.MathUtils.clamp(-dy / scale, 0, 1.15);
  const yaw = THREE.MathUtils.clamp(dx / scale, -1, 1) * MAX_YAW;

  const toRim = new THREE.Vector3(-from.x, 0, -from.z);
  const dist = toRim.length();
  toRim.normalize();
  const right = new THREE.Vector3().crossVectors(toRim, THREE.Object3D.DEFAULT_UP).normalize();
  const dir = toRim.clone().add(right.multiplyScalar(Math.tan(yaw))).normalize();

  const speed = idealSpeed(dist, RIM_HEIGHT - from.y) * (0.6 + 0.667 * power);
  out.copy(dir).multiplyScalar(speed * Math.cos(LAUNCH_ANGLE));
  out.y = speed * Math.sin(LAUNCH_ANGLE);
  return { velocity: out, power, dir };
}

/** Velocity for an automatic "perfect" shot (used by the home-page showcase). */
export function perfectVelocity(from: THREE.Vector3, jitter = 0) {
  const dist = Math.hypot(from.x, from.z);
  const speed = idealSpeed(dist, RIM_HEIGHT - from.y) * (1 + jitter);
  const dir = new THREE.Vector3(-from.x, 0, -from.z).normalize();
  const v = dir.multiplyScalar(speed * Math.cos(LAUNCH_ANGLE));
  v.y = speed * Math.sin(LAUNCH_ANGLE);
  return v;
}

/** Sample points along a projectile path, for the dotted aim arc. */
export function sampleArc(from: THREE.Vector3, v: THREE.Vector3, count: number, out: THREE.Vector3[]) {
  // time until the ball comes back down to rim height
  const a = -0.5 * GRAVITY;
  const b = v.y;
  const c = from.y - RIM_HEIGHT;
  const disc = b * b - 4 * a * c;
  const tEnd = disc > 0 ? (-b - Math.sqrt(disc)) / (2 * a) : 1.2;
  const tShow = Math.max(0.2, tEnd * 0.62); // show only part of the path: a hint, not a cheat
  for (let i = 0; i < count; i++) {
    const t = (i / (count - 1)) * tShow;
    out[i].set(from.x + v.x * t, from.y + v.y * t - 0.5 * GRAVITY * t * t, from.z + v.z * t);
  }
  return out;
}

export { RELEASE_HEIGHT };

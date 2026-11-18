// Court dimensions in metres (FIBA). The rim centre sits at world x=0, z=0.
// +z points from the hoop toward half court (where the shooter/camera is).

export const RIM_HEIGHT = 3.05;
export const RIM_RADIUS = 0.235;
export const RIM_TUBE = 0.014;
export const BALL_RADIUS = 0.12;

export const BOARD_FRONT_Z = -0.38; // front face of the backboard
export const BOARD_W = 1.8;
export const BOARD_H = 1.05;
export const BOARD_BOTTOM = 2.9;

export const BASELINE_Z = -1.575;
export const COURT_W = 15;
export const COURT_L = 14; // baseline → half-court line
export const HALF_LINE_Z = BASELINE_Z + COURT_L;

export const THREE_PT_RADIUS = 6.75;
export const THREE_PT_SIDE_X = 6.6;
export const KEY_W = 4.9;
export const FT_LINE_Z = BASELINE_Z + 5.8;

export const RELEASE_HEIGHT = 2.15;

export type Spot = { name: string; x: number; z: number };

// Ordered roughly from easiest to hardest.
export const SPOTS: Spot[] = [
  { name: "Free throw", x: 0, z: 4.6 },
  { name: "Left elbow", x: -2.45, z: 4.4 },
  { name: "Right elbow", x: 2.45, z: 4.4 },
  { name: "Left wing", x: -4.3, z: 3.4 },
  { name: "Right wing", x: 4.3, z: 3.4 },
  { name: "Top of the key", x: 0, z: 7.4 },
  { name: "Left wing three", x: -5.3, z: 5.1 },
  { name: "Right wing three", x: 5.3, z: 5.1 },
  { name: "Left corner three", x: -6.95, z: 0.6 },
  { name: "Right corner three", x: 6.95, z: 0.6 },
  { name: "Half-court", x: 0, z: HALF_LINE_Z - 0.05 },
];

export const HALF_COURT_SPOT = SPOTS.length - 1;

export function isThree(x: number, z: number) {
  return Math.hypot(x, z) > THREE_PT_RADIUS - 0.05 || Math.abs(x) > THREE_PT_SIDE_X;
}

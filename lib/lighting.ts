export type LightingName = "day" | "dawn" | "dusk" | "night";

export type LightingPreset = {
  label: string;
  skyTop: string;
  skyBottom: string;
  fog: string;
  fogNear: number;
  fogFar: number;
  hemiSky: string;
  hemiGround: string;
  hemiIntensity: number;
  sunColor: string;
  sunIntensity: number;
  sunPosition: [number, number, number];
  spotIntensity: number;
  emissive: number; // banner / lamp glow strength
  stars: number; // 0..1 opacity
};

export const LIGHTING_ORDER: LightingName[] = ["day", "dawn", "dusk", "night"];

export const LIGHTING: Record<LightingName, LightingPreset> = {
  day: {
    label: "Day",
    skyTop: "#4f9be0",
    skyBottom: "#cfe7f6",
    fog: "#cfe3f0",
    fogNear: 40,
    fogFar: 120,
    hemiSky: "#ffffff",
    hemiGround: "#9a8668",
    hemiIntensity: 1.25,
    sunColor: "#fff3df",
    sunIntensity: 2.2,
    sunPosition: [9, 22, 10],
    spotIntensity: 0,
    emissive: 0.15,
    stars: 0,
  },
  dawn: {
    label: "Dawn",
    skyTop: "#3d4c92",
    skyBottom: "#f7a582",
    fog: "#e7a891",
    fogNear: 25,
    fogFar: 95,
    hemiSky: "#ffd6c4",
    hemiGround: "#5c4a6c",
    hemiIntensity: 0.95,
    sunColor: "#ff9c62",
    sunIntensity: 2.0,
    sunPosition: [-20, 5.5, 6],
    spotIntensity: 0.5,
    emissive: 0.45,
    stars: 0.15,
  },
  dusk: {
    label: "Dusk",
    skyTop: "#2a1f5e",
    skyBottom: "#ff6b3f",
    fog: "#a8546c",
    fogNear: 25,
    fogFar: 90,
    hemiSky: "#ff9f80",
    hemiGround: "#3a2a4c",
    hemiIntensity: 0.75,
    sunColor: "#ff6a2c",
    sunIntensity: 1.7,
    sunPosition: [20, 4.5, -4],
    spotIntensity: 0.9,
    emissive: 0.9,
    stars: 0.35,
  },
  night: {
    label: "Night",
    skyTop: "#040916",
    skyBottom: "#16254d",
    fog: "#0d1832",
    fogNear: 30,
    fogFar: 100,
    hemiSky: "#5a78b8",
    hemiGround: "#0a0f1e",
    hemiIntensity: 0.45,
    sunColor: "#9fb8ff",
    sunIntensity: 0.35,
    sunPosition: [-8, 22, 10],
    spotIntensity: 1.5,
    emissive: 1.8,
    stars: 1,
  },
};

/** Pick a starting preset from the visitor's local clock. */
export function lightingForHour(hour: number): LightingName {
  if (hour >= 5 && hour < 8) return "dawn";
  if (hour >= 8 && hour < 17) return "day";
  if (hour >= 17 && hour < 20) return "dusk";
  return "night";
}

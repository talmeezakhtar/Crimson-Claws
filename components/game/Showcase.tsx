"use client";

import { useEffect } from "react";
import { lightingForHour } from "@/lib/lighting";
import { useGame } from "@/lib/store";
import Scene from "./Scene";

/** Self-playing court for the home page hero: the camera orbits and the ball shoots itself. */
export default function Showcase() {
  useEffect(() => {
    useGame.getState().setLighting(lightingForHour(new Date().getHours()));
  }, []);
  return (
    <div className="pointer-events-none h-full w-full">
      <Scene showcase />
    </div>
  );
}

"use client";

import dynamic from "next/dynamic";

function Loading() {
  return (
    <div className="grid h-full w-full place-items-center bg-night">
      <p className="animate-pulse text-night-muted">Opening the Kiln…</p>
    </div>
  );
}

// WebGL + physics only run in the browser, so skip server rendering for these.
export const GameLoader = dynamic(() => import("./GameView"), { ssr: false, loading: Loading });
export const ShowcaseLoader = dynamic(() => import("./Showcase"), { ssr: false, loading: Loading });
export const MascotLoader = dynamic(() => import("@/components/mascot/MascotStage"), { ssr: false, loading: Loading });

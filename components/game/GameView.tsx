"use client";

import { useEffect, useRef } from "react";
import { aim } from "@/lib/runtime";
import { crowdBed, unlockAudio } from "@/lib/audio";
import { ballById } from "@/lib/balls";
import { silence } from "@/lib/commentary";
import { lightingForHour } from "@/lib/lighting";
import { useGame } from "@/lib/store";
import Hud from "./Hud";
import Scene, { photo } from "./Scene";

export function savePhoto() {
  const url = photo.capture?.();
  if (!url) return;
  const a = document.createElement("a");
  a.href = url;
  a.download = `crimson-claws-${useGame.getState().lighting}-${Date.now()}.png`;
  a.click();
}

export default function GameView() {
  const start = useRef({ x: 0, y: 0, id: -1 });

  useEffect(() => {
    useGame.getState().setLighting(lightingForHour(new Date().getHours()));
    useGame.getState().toMenu();
    // /play?ball=crimson arrives from the shop's "Try it on the court" link
    const ball = new URLSearchParams(window.location.search).get("ball");
    if (ball) useGame.getState().setBall(ballById(ball).id);

    // crowd murmur while a game is on and sound is enabled
    const syncCrowd = (s: { sound: boolean; phase: string }) => {
      crowdBed(s.sound && s.phase !== "menu");
      if (!s.sound) silence();
    };
    syncCrowd(useGame.getState());
    const unsubscribe = useGame.subscribe(syncCrowd);

    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.metaKey || e.ctrlKey) return;
      const g = useGame.getState();
      const key = e.key.toLowerCase();
      if (key === "l") g.cycleLighting();
      else if (key === "c") g.cycleCamera();
      else if (key === "m") g.toggleSound();
      else if (key === "r") g.resetBall();
      else if (key === "p") savePhoto();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      unsubscribe();
      crowdBed(false);
      silence();
    };
  }, []);

  return (
    <div className="relative h-full w-full select-none overflow-hidden">
      <div
        className="absolute inset-0 cursor-grab touch-none active:cursor-grabbing"
        onPointerDown={(e) => {
          if (useGame.getState().phase !== "playing" || start.current.id !== -1) return;
          unlockAudio();
          e.currentTarget.setPointerCapture(e.pointerId);
          start.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
          Object.assign(aim, { active: true, dx: 0, dy: 0, fire: false });
        }}
        onPointerMove={(e) => {
          if (e.pointerId !== start.current.id) return;
          aim.dx = e.clientX - start.current.x;
          aim.dy = e.clientY - start.current.y;
        }}
        onPointerUp={(e) => {
          if (e.pointerId !== start.current.id) return;
          start.current.id = -1;
          aim.active = false;
          aim.fire = true;
        }}
        onPointerCancel={(e) => {
          if (e.pointerId !== start.current.id) return;
          start.current.id = -1;
          aim.active = false;
        }}
      >
        <Scene />
      </div>
      {/* court fades into the footer crimson below the fold */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-crimson via-crimson/45 to-transparent" />
      <Hud onPhoto={savePhoto} />
    </div>
  );
}

"use client";

import { useState, type ReactNode } from "react";
import { HALF_COURT_SPOT, SPOTS, isThree } from "@/lib/court";
import { LIGHTING, LIGHTING_ORDER, type LightingName } from "@/lib/lighting";
import { BALLS, ballById } from "@/lib/balls";
import { sfx, unlockAudio } from "@/lib/audio";
import { useGame, type Mode, type ShotEvent } from "@/lib/store";
import { announce, comment } from "@/lib/commentary";
import BallArt from "@/components/site/BallArt";
import SpotMap from "./SpotMap";
import {
  CameraIcon,
  ChevronIcon,
  DawnIcon,
  DuskIcon,
  MoonIcon,
  MuteIcon,
  PinIcon,
  ResetIcon,
  SoundIcon,
  SunIcon,
  ViewIcon,
} from "./Icons";

const CAMERA_LABEL = { shooter: "Shooter view", broadcast: "Broadcast view", top: "Top view" } as const;
const LIGHT_ICON: Record<LightingName, (p: { className?: string }) => ReactNode> = {
  day: SunIcon,
  dawn: DawnIcon,
  dusk: DuskIcon,
  night: MoonIcon,
};

const panel = "rounded-2xl bg-night/85 text-cream shadow-[0_10px_30px_-12px_rgba(0,0,0,0.6)] backdrop-blur-md";

function fmtTime(s: number) {
  const t = Math.ceil(s);
  return `${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}`;
}

function spotPoints(i: number) {
  const s = SPOTS[i];
  return isThree(s.x, s.z) || i === HALF_COURT_SPOT ? "3 pts" : "2 pts";
}

function click(fn: () => void) {
  return () => {
    unlockAudio();
    sfx.click();
    fn();
  };
}

function ToolButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      onClick={click(onClick)}
      aria-label={label}
      title={label}
      className={`${panel} grid h-11 w-11 place-items-center transition hover:-translate-y-0.5 hover:bg-crimson active:translate-y-0 active:scale-95`}
    >
      {children}
    </button>
  );
}

/** Keyed by event id, so each shot remounts it and replays the pop-and-fade animation. */
function Toast({ event }: { event: ShotEvent }) {
  const streak = useGame((s) => s.streak);
  const text =
    event.kind === "miss"
      ? "No good"
      : event.kind === "swish"
        ? `Swish +${event.points}`
        : `${event.three ? "Three" : "Bucket"} +${event.points}`;
  return (
    <div className="pointer-events-none absolute inset-x-0 top-[26%] flex animate-[toast_3.4s_ease-out_forwards] flex-col items-center">
      <p
        className={`display text-5xl drop-shadow-[0_4px_14px_rgba(43,10,14,0.8)] sm:text-7xl ${
          event.kind === "miss" ? "text-cream/75" : "text-cream"
        }`}
      >
        {text}
      </p>
      <p className="mt-2 max-w-md px-4 text-center text-lg font-medium text-cream drop-shadow-[0_2px_8px_rgba(43,10,14,0.95)] sm:text-xl">
        “{event.line}”
      </p>
      {event.kind !== "miss" && streak >= 4 && (
        <p className="mt-2 rounded-lg bg-crimson px-3 py-1 font-medium text-cream">On fire, {streak} in a row</p>
      )}
    </div>
  );
}

function Card({ children }: { children: ReactNode }) {
  return (
    <div className="absolute inset-0 grid place-items-center bg-night/45 p-4 backdrop-blur-[3px]">
      <div className="w-full max-w-md rounded-[22px] bg-cream p-7 text-ink shadow-[0_30px_80px_-30px_rgba(0,0,0,0.7)]">
        {children}
      </div>
    </div>
  );
}

function Menu() {
  const start = useGame((s) => s.start);
  const best = useGame((s) => s.best);
  const begin = (m: Mode) =>
    click(() => {
      start(m);
      announce(comment("gamestart"));
    })();
  return (
    <Card>
      <h2 className="display text-4xl">Step onto the Kiln</h2>
      <p className="mt-3 text-muted">
        Drag upward on the court and let go to shoot. A longer drag means more power; drag sideways to aim.
      </p>
      <div className="mt-6 grid gap-3">
        <button type="button" onClick={() => begin("shootaround")} className="lift rounded-xl bg-surface px-5 py-4 text-left">
          <span className="display block text-2xl">Shootaround</span>
          <span className="text-sm text-muted">Free play. Pick any spot, even half court.</span>
        </button>
        <button type="button" onClick={() => begin("challenge")} className="lift rounded-xl bg-crimson px-5 py-4 text-left text-cream">
          <span className="display block text-2xl">60-second challenge</span>
          <span className="text-sm text-cream/80">
            Around the world, all {SPOTS.length} spots{best ? `. Your best: ${best}` : ""}
          </span>
        </button>
      </div>
    </Card>
  );
}

function Results() {
  const { score, made, attempts, bestStreak, best, start, toMenu } = useGame();
  const pct = attempts ? Math.round((made / attempts) * 100) : 0;
  return (
    <Card>
      <h2 className="display text-3xl">Final buzzer</h2>
      <p className="num mt-2 text-8xl leading-none text-crimson">{score}</p>
      <p className="mt-1 text-muted">{score >= best && score > 0 ? "A new best score." : `Your best is ${best}.`}</p>
      <dl className="mt-6 grid grid-cols-3 border-t border-sand pt-4">
        {[
          ["Made", `${made}/${attempts}`],
          ["Accuracy", `${pct}%`],
          ["Best run", bestStreak],
        ].map(([k, v]) => (
          <div key={k}>
            <dd className="num text-2xl">{v}</dd>
            <dt className="text-xs text-muted">{k}</dt>
          </div>
        ))}
      </dl>
      <div className="mt-6 flex gap-3">
        <button type="button" onClick={toMenu} className="btn btn-secondary flex-1 text-ink">
          Back to menu
        </button>
        <button
          type="button"
          onClick={() => {
            start("challenge");
            announce(comment("gamestart"));
          }}
          className="btn btn-primary flex-1"
        >
          Play again
        </button>
      </div>
    </Card>
  );
}

type Open = "spot" | "ball" | null;

export default function Hud({ onPhoto }: { onPhoto: () => void }) {
  const g = useGame();
  const [open, setOpen] = useState<Open>(null);
  const spot = SPOTS[g.spotIndex % SPOTS.length];
  const ball = ballById(g.ball);
  const challenge = g.mode === "challenge";
  const toggle = (o: Open) => click(() => setOpen((cur) => (cur === o ? null : o)));

  return (
    <div className="on-night pointer-events-none absolute inset-0 text-cream [&_button]:pointer-events-auto">
      {open && <div className="pointer-events-auto absolute inset-0" onClick={() => setOpen(null)} aria-hidden />}

      {/* top left: where you shoot from, and with which ball */}
      <div className="absolute left-3 top-[4.5rem] flex max-w-[calc(100%-11rem)] flex-col items-start gap-2 sm:max-w-none sm:flex-row">
        <div className="relative">
          <button
            type="button"
            onClick={challenge ? undefined : toggle("spot")}
            aria-expanded={open === "spot"}
            aria-disabled={challenge}
            className={`${panel} flex h-12 items-center gap-2.5 pl-3 pr-3.5 text-left transition ${challenge ? "cursor-default" : "hover:bg-night"}`}
          >
            <PinIcon className="h-5 w-5 text-cream/70" />
            <span className="leading-tight">
              <span className="block text-[0.7rem] text-night-muted">{challenge ? "Around the world" : "Shooting from"}</span>
              <span className="block text-sm font-medium">
                {spot.name} <span className="text-night-muted">· {spotPoints(g.spotIndex)}</span>
              </span>
            </span>
            {!challenge && <ChevronIcon className="h-4 w-4 text-cream/60" />}
          </button>
          {open === "spot" && (
            <div className={`${panel} absolute left-0 top-14 z-10 w-[min(320px,calc(100vw-3rem))] bg-night/95 p-4`}>
              <p className="mb-3 text-sm font-medium">Tap where you want to shoot from</p>
              <SpotMap
                value={g.spotIndex}
                onChange={(i) => {
                  sfx.click();
                  g.chooseSpot(i);
                  setOpen(null);
                }}
              />
            </div>
          )}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={toggle("ball")}
            aria-expanded={open === "ball"}
            className={`${panel} flex h-12 items-center gap-2 pl-2 pr-3.5 transition hover:bg-night`}
          >
            <BallArt ball={ball} className="h-8 w-8" />
            <span className="hidden text-sm font-medium sm:inline">{ball.name}</span>
            <ChevronIcon className="h-4 w-4 text-cream/60" />
          </button>
          {open === "ball" && (
            <ul className={`${panel} absolute left-0 top-14 z-10 w-64 bg-night/95 p-2`}>
              {BALLS.map((b) => (
                <li key={b.id}>
                  <button
                    type="button"
                    onClick={click(() => {
                      g.setBall(b.id);
                      setOpen(null);
                    })}
                    aria-pressed={b.id === g.ball}
                    className={`flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-night-surface ${
                      b.id === g.ball ? "bg-night-surface" : ""
                    }`}
                  >
                    <BallArt ball={b} className="h-10 w-10" />
                    <span className="flex-1">
                      <span className="block text-sm font-medium">{b.name}</span>
                      <span className="num block text-xs text-night-muted">${b.price} in the shop</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* top right: score */}
      <dl className={`${panel} absolute right-3 top-[4.5rem] flex divide-x divide-night-surface`}>
        {[
          ["Score", g.score],
          ["Made", `${g.made}/${g.attempts}`],
          ...(challenge ? [["Time", fmtTime(g.timeLeft)]] : []),
        ].map(([k, v]) => (
          <div key={k} className="px-3.5 py-1.5 text-center">
            <dt className="text-[0.7rem] text-night-muted">{k}</dt>
            <dd
              className={`num text-2xl leading-tight ${k === "Time" && g.phase === "playing" && g.timeLeft <= 10 ? "text-[#ff8a8f]" : ""}`}
            >
              {v}
            </dd>
          </div>
        ))}
      </dl>

      {/* bottom left: tools */}
      <div className="absolute bottom-3 left-3 flex gap-2">
        <ToolButton label={CAMERA_LABEL[g.camera]} onClick={g.cycleCamera}>
          <ViewIcon />
        </ToolButton>
        <ToolButton label="Reset the ball" onClick={g.resetBall}>
          <ResetIcon />
        </ToolButton>
        <ToolButton label={g.sound ? "Mute sound" : "Turn sound on"} onClick={g.toggleSound}>
          {g.sound ? <SoundIcon /> : <MuteIcon />}
        </ToolButton>
        <ToolButton label="Save a photo" onClick={onPhoto}>
          <CameraIcon />
        </ToolButton>
      </div>

      {/* bottom right: time of day */}
      <div
        className={`${panel} absolute bottom-[4.25rem] right-3 flex p-1 sm:bottom-3`}
        role="group"
        aria-label="Time of day"
      >
        {LIGHTING_ORDER.map((name) => {
          const Icon = LIGHT_ICON[name];
          const active = g.lighting === name;
          return (
            <button
              key={name}
              type="button"
              onClick={click(() => g.setLighting(name))}
              aria-pressed={active}
              aria-label={LIGHTING[name].label}
              title={LIGHTING[name].label}
              className={`flex h-10 items-center gap-1.5 rounded-xl px-2.5 text-sm transition sm:px-3 ${
                active ? "bg-cream text-crimson" : "text-cream/80 hover:text-cream"
              }`}
            >
              <Icon className="h-[18px] w-[18px]" />
              <span className="hidden font-medium lg:inline">{LIGHTING[name].label}</span>
            </button>
          );
        })}
      </div>

      {g.phase === "playing" && g.attempts === 0 && (
        <p className="absolute inset-x-0 bottom-32 text-center text-lg font-medium text-cream drop-shadow-[0_2px_8px_rgba(43,10,14,0.9)] sm:bottom-24">
          Drag up and let go to shoot
        </p>
      )}

      {g.lastEvent && <Toast key={g.lastEvent.id} event={g.lastEvent} />}
      <div className="[&_*]:pointer-events-auto">
        {g.phase === "menu" && <Menu />}
        {g.phase === "over" && <Results />}
      </div>
    </div>
  );
}

"use client";

import { useGame } from "./store";

// Sarcastic courtside announcer. Only the recorded clips in public/audio play:
// /audio/<category>-NN.mp3, where NN is the line's number. No synthetic voice.

type Line = { n: number; text: string };

const LINES = {
  swish: [
    "Oh wow, it went in. Somebody alert the media.",
    "Swish. Even the net looks surprised.",
    "Clean. Suspiciously clean. Was that luck?",
    "Nothing but net. Don't let it go to your head.",
    "Look at that. A broken clock is right twice a day.",
  ],
  bank: [
    "Off the glass. Totally meant that. Sure.",
    "Bank shot! The backboard deserves an assist.",
    "Called it? No you didn't. But it counts.",
    "Used the backboard like training wheels. Cute.",
  ],
  rimin: [
    "It rattled in. The rim took pity on you.",
    "Ugly. Beautiful. Mostly ugly. Two points.",
    "That ball had a long think about it.",
    "The rim said no three times, then gave up.",
  ],
  three: [
    "From downtown! Who let you shoot that?",
    "Three points. Don't get comfortable.",
    "Splash! Even you didn't believe that.",
    "Deep three. Somebody check the replay.",
    "Bang! Okay, okay, we see you.",
  ],
  halfcourt: [
    "From half court?! I'm calling the league office.",
    "Logo shot! That should be illegal.",
    "Half court. You will never do that again. Ever.",
    "Absolutely not. And yet. There it is.",
    "From half court!", // clip 05 has no script line; caption kept generic
  ],
  onfire: [
    "On fire. Someone get a bucket of water.",
    "Can anybody stop this? Anybody? Hello?",
    "Okay, now you're just showing off.",
    "Four in a row. The rim has filed a complaint.",
    "Heating up. The arena insurance is nervous.",
  ],
  airball: [
    "Airball. The crowd will be bringing that up for weeks.",
    "Missed everything. The rim. The board. Reality.",
    "Nothing but air. Bold strategy.",
    "That was a pass. To nobody.",
    "Even Rex winced at that one.",
  ],
  rimout: [
    "In and out. The rim just laughed at you.",
    "So close. And yet, so, so far.",
    "Halfway down and it changed its mind.",
    "Off the iron. The rim sends its regards.",
    "That ball looked in and said, nah.",
  ],
  glassout: [
    "Off the glass and out. The backboard is not your friend.",
    "Way too strong. Were you aiming for the parking lot?",
    "The backboard rejected that. Personally.",
  ],
  halfcourtmiss: [
    "From half court? Sure. Why not. Nope.",
    "Long way. Wrong result.",
    "Ambitious. Deeply, deeply ambitious.",
  ],
  gamestart: [
    "Welcome to the Kiln. Try not to embarrass yourself.",
    "Sixty seconds. No pressure. Well, some pressure.",
  ],
  buzzer: [
    "And that's time. Let's never speak of it.",
    "Final buzzer. The judges are… unimpressed.",
    "Time's up. Somewhere, a coach is crying.",
  ],
  newbest: [
    "A new personal best! The bar was low, but still.",
    "Record broken. Frame it, I guess.",
  ],
} as const;

export type Category = keyof typeof LINES;

// Clip numbers that exist in public/audio (halfcourt-04 was never recorded).
const MISSING: Partial<Record<Category, number[]>> = { halfcourt: [4] };

const lastByCategory: Partial<Record<Category, number>> = {};

function pick(cat: Category): Line {
  const options = LINES[cat]
    .map((text, i) => ({ n: i + 1, text }))
    .filter((l) => !MISSING[cat]?.includes(l.n) && l.n !== lastByCategory[cat]);
  const line = options[Math.floor(Math.random() * options.length)];
  lastByCategory[cat] = line.n;
  return { ...line, text: line.text };
}

export type Comment = { cat: Category; n: number; text: string };

export function commentMake(o: { swish: boolean; board: boolean; three: boolean; halfCourt: boolean; streak: number }): Comment {
  const cat: Category = o.halfCourt
    ? "halfcourt"
    : o.streak >= 4
      ? "onfire"
      : o.three
        ? "three"
        : o.swish
          ? "swish"
          : o.board
            ? "bank"
            : "rimin";
  return { cat, ...pick(cat) };
}

export function commentMiss(o: { rim: boolean; board: boolean; halfCourt: boolean }): Comment {
  const cat: Category = o.halfCourt ? "halfcourtmiss" : o.rim ? "rimout" : o.board ? "glassout" : "airball";
  return { cat, ...pick(cat) };
}

export function comment(cat: Category): Comment {
  return { cat, ...pick(cat) };
}

let playing: HTMLAudioElement | null = null;

/** Play the recorded clip for a line (silently skipped if the browser blocks playback). */
export function announce(c: Comment) {
  if (typeof window === "undefined" || !useGame.getState().sound) return;
  playing?.pause();
  const clip = new Audio(`/audio/${c.cat}-${String(c.n).padStart(2, "0")}.mp3`);
  clip.play().catch(() => {});
  playing = clip;
}

/** Stop the announcer (sound toggled off, page left). */
export function silence() {
  playing?.pause();
  playing = null;
}

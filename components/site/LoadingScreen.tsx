"use client";

import { useEffect, useState } from "react";

// First-visit intro: club words swap letter by letter on crimson, the name lands in gold, then the panel
// wipes up to the page, which has been loading underneath. Pure CSS timeline (globals.css, "loader"),
// so it runs from the first paint; this component only removes it once the wipe is over.

const WORDS = ["Warm up", "Shoot", "Score"];
const FINAL = "Crimson Claws";
const HOLLOW = new Set([1, 2]); // the reference outlines a pair of middle letters in each word

function Word({ text, slot, final = false }: { text: string; slot: number; final?: boolean }) {
  return (
    <span className={`cc-word${final ? " cc-final" : ""}`} aria-hidden>
      {[...text].map((ch, i) => (
        <span key={i} className="cc-mask">
          <span
            className={`cc-letter${HOLLOW.has(i) && ch !== " " ? " cc-hollow" : ""}`}
            style={{ animationDelay: `${slot * 0.6 + 0.15 + i * 0.035}s` }}
          >
            {ch === " " ? " " : ch}
          </span>
        </span>
      ))}
    </span>
  );
}

export default function LoadingScreen() {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    try {
      sessionStorage.setItem("cc-intro", "1");
    } catch {}
    // The CSS timeline starts at first paint and ends at ~3.75s; time from page load, not from hydration,
    // so a slow hydrate never leaves the curtain (or the scroll lock) behind.
    const html = document.documentElement;
    if (html.dataset.intro !== "playing") return;
    const left = Math.max(0, 3800 - performance.now());
    const hide = setTimeout(() => setGone(true), left);
    const done = setTimeout(() => (html.dataset.intro = "seen"), left + 1000);
    return () => {
      clearTimeout(hide);
      clearTimeout(done);
    };
  }, []);

  if (gone) return null;
  return (
    <div
      className="cc-loader"
      role="status"
      aria-label="Loading Crimson Claws"
    >
      <div className="cc-stage">
        {WORDS.map((w, i) => (
          <Word key={w} text={w} slot={i} />
        ))}
        <Word text={FINAL} slot={WORDS.length} final />
      </div>
    </div>
  );
}


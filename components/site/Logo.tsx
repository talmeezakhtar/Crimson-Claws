"use client";

import { useState } from "react";

/** Drawn stand-in mark: a ball traced in dots, shown if /brand/logo-mark.webp fails to load. */
const DOTS = (() => {
  const pts: [number, number, number][] = [];
  for (let ring = 0; ring < 3; ring++) {
    const r = 5 + ring * 5;
    const n = 6 + ring * 6;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + ring * 0.26;
      const x = 16 + Math.cos(a) * r;
      const y = 16 + Math.sin(a) * r;
      if (Math.abs(x - 16) < 1.3 || Math.abs(y - 16) < 1.3) continue;
      pts.push([x, y, 1.55 - ring * 0.18]);
    }
  }
  return pts;
})();

export function BallMark({ className = "h-8 w-8", color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      {DOTS.map(([x, y, r], i) => (
        <circle key={i} cx={x.toFixed(2)} cy={y.toFixed(2)} r={r} fill={color} />
      ))}
      <circle cx="16" cy="16" r="2.2" fill={color} />
    </svg>
  );
}

/** The club's claw-and-ball logo, falling back to the drawn mark if the file is missing. */
export function ClawMark({ className = "h-9 w-9" }: { className?: string }) {
  const [missing, setMissing] = useState(false);
  if (missing) return <BallMark className={className} />;
  return (
    // eslint-disable-next-line @next/next/no-img-element -- small brand mark that must fall back on error
    <img src="/brand/logo-mark.webp" width={96} height={96} alt="" className={`${className} object-contain`} onError={() => setMissing(true)} />
  );
}

export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <span className={`flex items-center gap-2 ${light ? "text-cream" : "text-crimson"}`}>
      <ClawMark />
      {/* inline: .display's text-wrap: balance sits outside Tailwind's layers and beats the nowrap utility */}
      <span style={{ whiteSpace: "nowrap" }} className={`display text-[1.9rem] leading-none ${light ? "text-cream" : "text-ink"}`}>
        Crimson <span className={light ? "text-cream" : "text-crimson"}>Claws</span>
      </span>
    </span>
  );
}

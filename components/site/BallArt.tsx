import type { BallType } from "@/lib/balls";

/** Flat ball drawing in the shop's colours; the game paints the same colours in 3D. */
export default function BallArt({ ball, className = "h-48 w-48" }: { ball: BallType; className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} role="img" aria-label={`${ball.name} basketball`}>
      <ellipse cx="60" cy="112" rx="34" ry="5" fill="#2b0a0e" opacity="0.18" />
      <circle cx="60" cy="58" r="48" fill={ball.base} />
      <circle cx="60" cy="58" r="48" fill="url(#shade)" />
      <g fill="none" stroke={ball.seam} strokeWidth="3.2" strokeLinecap="round">
        <circle cx="60" cy="58" r="48" />
        <path d="M60 10v96M12 58h96M27 24c13 9 19 21 19 34s-6 25-19 34M93 24c-13 9-19 21-19 34s6 25 19 34" />
      </g>
      <defs>
        <radialGradient id="shade" cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#fff" stopOpacity="0.28" />
          <stop offset="0.6" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.22" />
        </radialGradient>
      </defs>
    </svg>
  );
}

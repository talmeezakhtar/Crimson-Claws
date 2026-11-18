"use client";

import { BASELINE_Z, COURT_L, COURT_W, FT_LINE_Z, KEY_W, SPOTS, THREE_PT_RADIUS, THREE_PT_SIDE_X, isThree, HALF_COURT_SPOT } from "@/lib/court";

const W = COURT_W;
const H = COURT_L;
// court metres → map coordinates (baseline at the top, half court at the bottom)
const mx = (x: number) => x + W / 2;
const my = (z: number) => z - BASELINE_Z;

function spotKind(i: number) {
  if (i === HALF_COURT_SPOT) return "3 points";
  return isThree(SPOTS[i].x, SPOTS[i].z) ? "3 points" : "2 points";
}

/** Tap-to-choose half-court map. Each spot is a real button laid over the court drawing. */
export default function SpotMap({ value, onChange }: { value: number; onChange: (i: number) => void }) {
  const corner = Math.sqrt(THREE_PT_RADIUS ** 2 - THREE_PT_SIDE_X ** 2);
  const arcStart = [mx(-THREE_PT_SIDE_X), my(corner)];
  const arcEnd = [mx(THREE_PT_SIDE_X), my(corner)];

  return (
    <div>
      <div className="relative mx-auto w-full max-w-[300px]" style={{ aspectRatio: `${W} / ${H}` }}>
        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" aria-hidden>
          <rect x="0" y="0" width={W} height={H} rx="0.3" fill="#c98a52" />
          <rect x={mx(-KEY_W / 2)} y="0" width={KEY_W} height={my(FT_LINE_Z)} fill="#790b13" />
          <g fill="none" stroke="#fff0dc" strokeWidth="0.09">
            <rect x="0.05" y="0.05" width={W - 0.1} height={H - 0.1} />
            <rect x={mx(-KEY_W / 2)} y="0" width={KEY_W} height={my(FT_LINE_Z)} />
            <circle cx={mx(0)} cy={my(FT_LINE_Z)} r="1.8" />
            <path
              d={`M${mx(-THREE_PT_SIDE_X)} 0 L${arcStart[0]} ${arcStart[1]} A${THREE_PT_RADIUS} ${THREE_PT_RADIUS} 0 0 0 ${arcEnd[0]} ${arcEnd[1]} L${mx(THREE_PT_SIDE_X)} 0`}
            />
            <circle cx={mx(0)} cy={H} r="1.8" />
          </g>
          <circle cx={mx(0)} cy={my(0)} r="0.24" fill="none" stroke="#2b0a0e" strokeWidth="0.1" />
          <line x1={mx(-0.9)} x2={mx(0.9)} y1={my(-0.38)} y2={my(-0.38)} stroke="#2b0a0e" strokeWidth="0.14" />
        </svg>

        {SPOTS.map((s, i) => {
          const active = i === value;
          return (
            <button
              key={s.name}
              type="button"
              onClick={() => onChange(i)}
              aria-pressed={active}
              aria-label={`${s.name}, ${spotKind(i)}`}
              title={`${s.name} · ${spotKind(i)}`}
              className="absolute grid h-9 w-9 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full transition-transform hover:scale-110"
              style={{ left: `${(mx(s.x) / W) * 100}%`, top: `${(Math.min(my(s.z), H - 0.6) / H) * 100}%` }}
            >
              <span
                className={`block rounded-full border-2 ${
                  active
                    ? "h-5 w-5 border-cream bg-crimson shadow-[0_0_0_3px_rgba(121,11,19,0.45)]"
                    : i === HALF_COURT_SPOT
                      ? "h-4 w-4 border-cream bg-night"
                      : isThree(s.x, s.z)
                        ? "h-3.5 w-3.5 border-night bg-cream"
                        : "h-3.5 w-3.5 border-cream bg-night"
                }`}
              />
            </button>
          );
        })}
      </div>
      <ul className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-night-muted">
        <li className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full border-2 border-cream bg-night" /> 2 points
        </li>
        <li className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full border-2 border-night bg-cream" /> 3 points
        </li>
        <li className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full border-2 border-cream bg-crimson" /> Your spot
        </li>
      </ul>
    </div>
  );
}

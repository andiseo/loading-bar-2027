import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BATCH3 } from "../../styles/layout";
import { useTheme } from "../../styles/theme";
import { CLAMP, introProgress } from "../anim";
import { Label } from "../Label";
import { HudYear, part, useHudExit, useIdle, useOutro } from "./HudYear";

type Pt = { x: number; y: number };
type Piece =
  | { kind: "line"; a: Pt; b: Pt; len: number }
  | { kind: "arc"; c: Pt; v0: Pt; v1: Pt; len: number };

// One winding route with rounded corners, from the left edge into the
// centre of the frame, where 2027 lands. Points are relative to the canvas.
const ROUTE: Pt[] = [
  { x: 300, y: 1500 },
  { x: 820, y: 1500 },
  { x: 820, y: 640 },
  { x: 1380, y: 640 },
  { x: 1380, y: 1080 },
  { x: 1920, y: 1080 },
];
// A faint, dashed "road ahead" leaving 2027 to the right.
const AHEAD: Pt[] = [
  { x: 1920, y: 1080 },
  { x: 2600, y: 1080 },
  { x: 2600, y: 640 },
  { x: 3540, y: 640 },
];
const CORNER = 110;
// Stops sit on straight parts of the route, clear of the 2027 area.
const STATIONS = [
  { year: 2021, at: 0.03 },
  { year: 2022, at: 0.12 },
  { year: 2023, at: 0.27 },
  { year: 2024, at: 0.4 },
  { year: 2025, at: 0.57 },
  { year: 2026, at: 0.74 },
];

const unit = (a: Pt, b: Pt): Pt => {
  const d = Math.hypot(b.x - a.x, b.y - a.y);
  return { x: (b.x - a.x) / d, y: (b.y - a.y) / d };
};

// Turns an orthogonal polyline into line + quarter-arc pieces and an SVG path.
const buildRoute = (pts: Pt[], r: number) => {
  const pieces: Piece[] = [];
  let d = "";
  for (let i = 0; i < pts.length - 1; i++) {
    const dir = unit(pts[i], pts[i + 1]);
    const s =
      i === 0 ? pts[i] : { x: pts[i].x + dir.x * r, y: pts[i].y + dir.y * r };
    const last = i === pts.length - 2;
    const e = last
      ? pts[i + 1]
      : { x: pts[i + 1].x - dir.x * r, y: pts[i + 1].y - dir.y * r };
    if (i === 0) d += `M ${s.x} ${s.y} `;
    d += `L ${e.x} ${e.y} `;
    pieces.push({
      kind: "line",
      a: s,
      b: e,
      len: Math.hypot(e.x - s.x, e.y - s.y),
    });
    if (!last) {
      const out = unit(pts[i + 1], pts[i + 2]);
      const c = {
        x: pts[i + 1].x - dir.x * r + out.x * r,
        y: pts[i + 1].y - dir.y * r + out.y * r,
      };
      const next = { x: pts[i + 1].x + out.x * r, y: pts[i + 1].y + out.y * r };
      const cross = dir.x * out.y - dir.y * out.x;
      d += `A ${r} ${r} 0 0 ${cross > 0 ? 1 : 0} ${next.x} ${next.y} `;
      pieces.push({
        kind: "arc",
        c,
        v0: { x: e.x - c.x, y: e.y - c.y },
        v1: { x: next.x - c.x, y: next.y - c.y },
        len: (Math.PI * r) / 2,
      });
    }
  }
  const total = pieces.reduce((sum, p) => sum + p.len, 0);
  return { pieces, d, total };
};

// Point and travel direction at distance `dist` along the route.
const pointAt = (pieces: Piece[], dist: number) => {
  let rest = dist;
  for (const p of pieces) {
    if (rest <= p.len || p === pieces[pieces.length - 1]) {
      const u = Math.max(0, Math.min(1, rest / p.len));
      if (p.kind === "line") {
        return {
          x: p.a.x + (p.b.x - p.a.x) * u,
          y: p.a.y + (p.b.y - p.a.y) * u,
          vertical: p.a.x === p.b.x,
        };
      }
      const t = (u * Math.PI) / 2;
      return {
        x: p.c.x + p.v0.x * Math.cos(t) + p.v1.x * Math.sin(t),
        y: p.c.y + p.v0.y * Math.cos(t) + p.v1.y * Math.sin(t),
        vertical: false,
      };
    }
    rest -= p.len;
  }
  return { x: 0, y: 0, vertical: false };
};

// A journey through the years: light travels a winding route, lighting one
// stop per year, and arrives at 2027 at 5s.
export const YearRouteScene: React.FC<{ yearSize: number }> = ({
  yearSize,
}) => {
  const C = useTheme();
  const T = C.text ?? C.primary;
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const K = BATCH3.keyFrame;
  const arrive = K - BATCH3.lead;
  const intro = introProgress(frame);
  const exit = useHudExit();
  const outro = useOutro();
  const idle = useIdle();

  const route = useMemo(() => buildRoute(ROUTE, CORNER), []);
  const ahead = useMemo(() => buildRoute(AHEAD, CORNER), []);
  const { pieces, d, total } = route;

  const travel = interpolate(frame, [6, arrive], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.sin),
  });
  const head = pointAt(pieces, travel * total);
  const arrived = frame >= arrive;
  const routeDim = interpolate(frame, [arrive, K], [1, 0.45], CLAMP);
  // Outro: the route clears from the first stop towards 2027.
  const clear = part(outro, 0, 0.75);
  const current = [...STATIONS].reverse().find((s) => travel >= s.at);

  return (
    <AbsoluteFill style={{ backgroundColor: C.background }}>
      <svg
        width={width}
        height={height}
        style={{ position: "absolute", opacity: intro }}
      >
        {/* Road ahead: faint and dashed, appears once 2027 is reached */}
        <path
          d={ahead.d}
          fill="none"
          stroke={C.secondary}
          strokeWidth={3}
          strokeDasharray="6 22"
          opacity={
            interpolate(frame, [arrive, K + 10], [0, 0.45], CLAMP) *
            (1 - part(outro, 0, 0.5))
          }
        />

        <g opacity={routeDim}>
          {/* Full route (dim) and travelled part (bright) */}
          <path
            d={d}
            fill="none"
            stroke={C.dim}
            strokeWidth={6}
            strokeDasharray={`${total} ${total}`}
            strokeDashoffset={-clear * total}
          />
          <path
            d={d}
            fill="none"
            stroke={C.primary}
            strokeWidth={6}
            strokeLinecap="round"
            strokeDasharray={`${travel * total * (1 - clear)} ${total * 2}`}
            strokeDashoffset={-clear * total}
          />

          {/* Idle: faint light pulses keep flowing along the route */}
          {frame > K
            ? [0, 0.5].map((offset) => {
                const pos = ((idle * 0.35 + offset) % 1) * total;
                const p = pointAt(pieces, pos);
                const visible = pos / total > clear;
                return visible ? (
                  <circle
                    key={offset}
                    cx={p.x}
                    cy={p.y}
                    r={12}
                    fill={T}
                    opacity={0.6 * Math.min(1, idle * 3)}
                  />
                ) : null;
              })
            : null}

          {/* Stops */}
          {STATIONS.map((s) => {
            const p = pointAt(pieces, s.at * total);
            const lit = travel >= s.at;
            const gone = clear > s.at;
            return (
              <g key={s.year} opacity={gone ? 0 : 1}>
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={26}
                  fill={
                    C.background === "transparent" ? "#01040C" : C.background
                  }
                  stroke={lit ? C.primary : C.muted}
                  strokeWidth={6}
                />
                {lit ? <circle cx={p.x} cy={p.y} r={10} fill={T} /> : null}
              </g>
            );
          })}
        </g>

        {/* Travelling light */}
        {!arrived ? <circle cx={head.x} cy={head.y} r={20} fill={T} /> : null}
      </svg>

      {/* Year labels next to each stop */}
      <AbsoluteFill style={{ opacity: intro * routeDim }}>
        {STATIONS.map((s) => {
          const p = pointAt(pieces, s.at * total);
          const lit = travel >= s.at;
          return (
            <Label
              key={s.year}
              size="secondary"
              weight={lit ? "bold" : "medium"}
              color={lit ? T : C.muted}
              style={{
                position: "absolute",
                left: p.vertical ? p.x + 54 : p.x,
                top: p.vertical ? p.y : p.y - 74,
                transform: p.vertical ? "translateY(-50%)" : "translateX(-50%)",
                opacity: clear > s.at ? 0 : 1,
              }}
            >
              {s.year}
            </Label>
          );
        })}
      </AbsoluteFill>

      <AbsoluteFill style={{ opacity: intro * exit }}>
        <div
          style={{
            position: "absolute",
            left: 220,
            top: 200,
            display: "flex",
            flexDirection: "column",
            gap: 24,
          }}
        >
          <Label size="heading" tracking={2} color={T}>
            YEAR ROUTE
          </Label>
          <Label size="secondary" color={C.secondary}>
            NOW PASSING {current ? current.year : 2020}
          </Label>
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <HudYear fontSize={yearSize} outWindow={[0.55, 1]} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

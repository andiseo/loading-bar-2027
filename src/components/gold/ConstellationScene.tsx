import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BATCH3 } from "../../styles/layout";
import { useTheme } from "../../styles/theme";
import { CLAMP, introProgress } from "../anim";
import { part, useIdle, useOutro } from "../hud/HudYear";

// Star paths for each digit, in a 100 x 160 box. Drawn for this asset.
const DIGITS: Record<string, [number, number][]> = {
  "2": [
    [8, 38],
    [30, 6],
    [72, 6],
    [92, 34],
    [86, 70],
    [10, 154],
    [92, 154],
  ],
  "0": [
    [50, 4],
    [86, 30],
    [92, 80],
    [86, 130],
    [50, 156],
    [14, 130],
    [8, 80],
    [14, 30],
    [50, 4],
  ],
  "7": [
    [8, 6],
    [92, 6],
    [62, 70],
    [40, 154],
  ],
};
const BG_STARS = 140;

type Star = { x: number; y: number; litAt: number; size: number };
type Link = { a: Star; b: Star; at: number };

// Gold stars light up one by one and link into the shape of 2027.
// Fully formed at 5s; faint background stars drift during the hold.
export const ConstellationScene: React.FC<{ scale: number; gap: number }> = ({
  scale,
  gap,
}) => {
  const C = useTheme();
  const T = C.text ?? C.primary;
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const K = BATCH3.keyFrame;
  const done = K - BATCH3.lead;
  const intro = introProgress(frame);
  const outro = useOutro();
  const idle = useIdle();

  const { stars, links } = useMemo(() => {
    const digitW = 100 * scale;
    const totalW = 4 * digitW + 3 * gap;
    const x0 = (width - totalW) / 2;
    const y0 = (height - 160 * scale) / 2;
    const all: Star[] = [];
    const ls: Link[] = [];
    const paths = "2027".split("").map((ch) => DIGITS[ch]);
    const count = paths.reduce((n, p) => n + p.length, 0);
    let k = 0;
    paths.forEach((path, d) => {
      let prev: Star | null = null;
      path.forEach(([px, py], i) => {
        const closing =
          i === path.length - 1 && px === path[0][0] && py === path[0][1];
        const litAt = 8 + (k / count) * (done - 14);
        const star: Star = closing
          ? (all[all.length - path.length + 1] as Star)
          : {
              x: x0 + d * (digitW + gap) + px * scale,
              y: y0 + py * scale,
              litAt,
              size: i === 0 ? 16 : 12,
            };
        if (!closing) all.push(star);
        if (prev) ls.push({ a: prev, b: star, at: litAt });
        prev = star;
        k++;
      });
    });
    return { stars: all, links: ls };
  }, [width, height, scale, gap, done]);

  const bg = useMemo(
    () =>
      Array.from({ length: BG_STARS }).map((_, i) => ({
        x: random(`bx${i}`) * width,
        y: random(`by${i}`) * height,
        r: 2 + random(`br${i}`) * 4,
        o: 0.15 + random(`bo${i}`) * 0.35,
        speed: 0.4 + random(`bs${i}`) * 0.8,
      })),
    [width, height],
  );

  const flash = interpolate(frame, [done, K], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  // Outro: links retract and stars go out, last ones first.
  const gone = part(outro, 0, 0.85);
  const total = links.length;

  return (
    <AbsoluteFill style={{ backgroundColor: C.background }}>
      <svg
        width={width}
        height={height}
        style={{ position: "absolute", opacity: intro }}
      >
        {/* Background stars drift slowly to the left during the hold */}
        <g opacity={1 - part(outro, 0.3, 1)}>
          {bg.map((s, i) => (
            <circle
              key={i}
              cx={(((s.x - idle * 40 * s.speed) % width) + width) % width}
              cy={s.y}
              r={s.r}
              fill={C.secondary}
              opacity={s.o}
            />
          ))}
        </g>

        {links.map((l, i) => {
          const p = interpolate(frame, [l.at - 6, l.at], [0, 1], CLAMP);
          const out = i >= total * (1 - gone);
          if (p <= 0 || out) return null;
          return (
            <line
              key={i}
              x1={l.a.x}
              y1={l.a.y}
              x2={l.a.x + (l.b.x - l.a.x) * p}
              y2={l.a.y + (l.b.y - l.a.y) * p}
              stroke={C.primary}
              strokeWidth={4 + flash * 2}
              opacity={0.8}
            />
          );
        })}

        {stars.map((s, i) => {
          const on = frame >= s.litAt;
          const out = i >= stars.length * (1 - gone);
          if (!on || out) return null;
          const pop = interpolate(
            frame,
            [s.litAt, s.litAt + 8],
            [1.8, 1],
            CLAMP,
          );
          return (
            <g key={i}>
              <circle
                cx={s.x}
                cy={s.y}
                r={s.size * 2.6 * pop}
                fill={C.primary}
                opacity={0.18 + flash * 0.12}
              />
              <circle cx={s.x} cy={s.y} r={s.size * pop} fill={T} />
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

import React from "react";
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
import { HudYear, part, useIdle, useOutro } from "../hud/HudYear";
import { polar } from "../hud/geom";

type Burst = {
  start: number;
  x: number;
  y: number;
  size: number;
  rays: number;
  tilt: number;
};

const BURST_FRAMES = 40;

// One geometric firework per second, each made of straight rays and dots.
// The last one bursts from the centre just before 5s and leaves 2027
// inside a slowly turning ring of sparks.
export const GeoBurstScene: React.FC<{ yearSize: number }> = ({ yearSize }) => {
  const C = useTheme();
  const T = C.text ?? C.primary;
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const K = BATCH3.keyFrame;
  const intro = introProgress(frame);
  const outro = useOutro();
  const idle = useIdle();
  const cx = width / 2;
  const cy = height / 2;

  const bursts: Burst[] = [
    { start: 4, x: cx - 1100, y: cy - 380, size: 420, rays: 12, tilt: 0 },
    { start: 32, x: cx + 1050, y: cy - 260, size: 480, rays: 14, tilt: 8 },
    { start: 60, x: cx - 700, y: cy + 420, size: 380, rays: 10, tilt: 4 },
    { start: 88, x: cx + 820, y: cy + 380, size: 440, rays: 12, tilt: 12 },
    { start: 100, x: cx, y: cy - 620, size: 360, rays: 10, tilt: 0 },
  ];
  const finalStart = K - BATCH3.lead - 4;
  const finalP = interpolate(frame, [finalStart, K], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });

  const renderBurst = (b: Burst, key: string) => {
    const local = frame - b.start;
    if (local < 0 || local > BURST_FRAMES) return null;
    const p = local / BURST_FRAMES;
    const e = Easing.out(Easing.cubic)(p);
    const inner = b.size * interpolate(p, [0.2, 1], [0, 0.8], CLAMP);
    const outer = b.size * e;
    return (
      <g key={key} opacity={interpolate(p, [0, 0.1, 0.7, 1], [0, 1, 1, 0])}>
        {Array.from({ length: b.rays }).map((_, i) => {
          const a = (i / b.rays) * 360 + b.tilt;
          const [x1, y1] = polar(b.x, b.y, inner, a);
          const [x2, y2] = polar(b.x, b.y, outer, a);
          const [dx, dy] = polar(b.x, b.y, outer + 24, a);
          return (
            <g key={i}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={i % 2 ? C.secondary : C.primary}
                strokeWidth={5}
              />
              <circle cx={dx} cy={dy} r={7} fill={T} />
            </g>
          );
        })}
      </g>
    );
  };

  // Spark ring around 2027: born from the final burst, turns slowly in idle.
  const ringR = interpolate(finalP, [0, 1], [120, 760]);
  const ringOut = part(outro, 0, 0.8);

  return (
    <AbsoluteFill style={{ backgroundColor: C.background }}>
      <svg
        width={width}
        height={height}
        style={{ position: "absolute", opacity: intro }}
      >
        {bursts.map((b, i) => renderBurst(b, `b${i}`))}

        {frame >= finalStart ? (
          <g opacity={1 - part(outro, 0.3, 1)}>
            {Array.from({ length: 36 }).map((_, i) => {
              const a = i * 10 + idle * 6;
              const r = ringR + ringOut * 500;
              const len = i % 3 === 0 ? 70 : 34;
              const [x1, y1] = polar(cx, cy, r, a);
              const [x2, y2] = polar(cx, cy, r + len * finalP, a);
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={i % 3 === 0 ? C.primary : C.secondary}
                  strokeWidth={i % 3 === 0 ? 6 : 4}
                  strokeLinecap="round"
                />
              );
            })}
          </g>
        ) : null}
      </svg>

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <HudYear fontSize={yearSize} outWindow={[0, 0.6]} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

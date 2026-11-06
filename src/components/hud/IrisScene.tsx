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
import { Label } from "../Label";
import { polar } from "./geom";
import { HudYear, useOutro, part, useIdle } from "./HudYear";

const BLADES = 8;
const STOPS = ["F16", "F11", "F8", "F5.6", "F4", "F2.8", "F2", "F1.4"];

// An eight-blade aperture opens step by step (F16 to F1.4) and is wide
// open exactly at 5s, showing 2027 behind it.
export const IrisScene: React.FC<{ radius: number; yearSize: number }> = ({
  radius,
  yearSize,
}) => {
  const C = useTheme();
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const K = BATCH3.keyFrame;
  const intro = introProgress(frame);
  const outro = useOutro();
  // Idle motion during the hold (slow, keeps running into the outro).
  const idle = useIdle();
  const cx = width / 2;
  const cy = height / 2;

  // Opening in steps: each stop eases in, then holds briefly.
  const stepFrames = (K - 6) / STOPS.length;
  const step = Math.min(STOPS.length - 1, Math.floor(frame / stepFrames));
  const local = interpolate(
    frame - step * stepFrames,
    [0, stepFrames * 0.6],
    [0, 1],
    {
      ...CLAMP,
      easing: Easing.out(Easing.cubic),
    },
  );
  // Outro: the aperture closes again over 2027.
  const open =
    (frame >= K - 6 ? 1 : (step + local) / STOPS.length) *
    (1 - part(outro, 0, 0.8));
  const hole = interpolate(open, [0, 1], [radius * 0.06, radius * 0.98]);
  const twist = interpolate(open, [0, 1], [0, 60]);

  // Hole polygon + blade edge lines.
  const verts = Array.from({ length: BLADES }).map((_, k) =>
    polar(cx, cy, hole, k * (360 / BLADES) + twist),
  );
  const holePath =
    verts.map(([x, y], k) => `${k === 0 ? "M" : "L"} ${x} ${y}`).join(" ") +
    " Z";
  const outerPath = `M ${cx - radius} ${cy} a ${radius} ${radius} 0 1 0 ${2 * radius} 0 a ${radius} ${radius} 0 1 0 ${-2 * radius} 0 Z`;
  const bladeOpacity = interpolate(open, [0.85, 1], [1, 0], CLAMP);

  return (
    <AbsoluteFill style={{ backgroundColor: C.background }}>
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <HudYear fontSize={yearSize} outScale={0.95} outWindow={[0, 0.3]} />
      </AbsoluteFill>

      <svg
        width={width}
        height={height}
        style={{
          position: "absolute",
          opacity: intro * (1 - part(outro, 0.75, 1)),
        }}
      >
        {/* Blades: the ring area minus the hole */}
        <g opacity={bladeOpacity}>
          <path
            d={`${outerPath} ${holePath}`}
            fillRule="evenodd"
            fill={C.dim}
          />
          {verts.map(([x, y], k) => {
            const [ox, oy] = polar(
              cx,
              cy,
              radius,
              k * (360 / BLADES) + twist + 70,
            );
            return (
              <line
                key={k}
                x1={x}
                y1={y}
                x2={ox}
                y2={oy}
                stroke={C.primary}
                strokeWidth={4}
              />
            );
          })}
          <path d={holePath} fill="none" stroke={C.secondary} strokeWidth={3} />
        </g>
        {/* Housing */}
        <circle
          cx={cx}
          cy={cy}
          r={radius}
          fill="none"
          stroke={C.primary}
          strokeWidth={8}
        />
        <circle
          cx={cx}
          cy={cy}
          r={radius + 60}
          fill="none"
          stroke={C.dim}
          strokeWidth={3}
        />
        {Array.from({ length: 72 }).map((_, i) => {
          const [x1, y1] = polar(cx, cy, radius + 60, i * 5 + idle * 6);
          const [x2, y2] = polar(
            cx,
            cy,
            radius + (i % 9 === 0 ? 110 : 85),
            i * 5 + idle * 6,
          );
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={i % 9 === 0 ? C.secondary : C.muted}
              strokeWidth={3}
            />
          );
        })}
      </svg>

      <AbsoluteFill style={{ opacity: intro * (1 - part(outro, 0, 0.4)) }}>
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
          <Label size="heading" tracking={2} color={C.text}>
            APERTURE
          </Label>
          <Label size="heading" weight="regular" color={C.secondary}>
            {STOPS[frame >= K - 6 ? STOPS.length - 1 : step]}
          </Label>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

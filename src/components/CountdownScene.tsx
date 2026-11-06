import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { useTheme } from "../styles/theme";
import { LINE_WIDTH, TIMING } from "../styles/layout";
import { TYPOGRAPHY } from "../styles/typography";
import { CLAMP, exitOpacity, introProgress } from "./anim";
import { Label } from "./Label";
import { YearReveal } from "./YearReveal";

const SEGMENTS = 10;
const GAP_DEG = 4;
const OUTER_TICKS = 60;

const polar = (cx: number, cy: number, r: number, deg: number) => {
  const rad = ((deg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(rad), cy + r * Math.sin(rad)] as const;
};

const arc = (cx: number, cy: number, r: number, from: number, to: number) => {
  const [x1, y1] = polar(cx, cy, r, from);
  const [x2, y2] = polar(cx, cy, r, to);
  const large = to - from > 180 ? 1 : 0;
  return `M ${x1} ${y1} A ${r} ${r} 0 ${large} 1 ${x2} ${y2}`;
};

// 10 to 1 countdown inside a 10-segment ring. One segment drains per second.
// At 10s the ring opens outward and 2027 lands.
export const CountdownScene: React.FC<{
  ringRadius: number;
  numberSize: number;
  yearSize: number;
}> = ({ ringRadius, numberSize, yearSize }) => {
  const C = useTheme();
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const R = TIMING.revealFrame;
  const cx = width / 2;
  const cy = height / 2;

  const intro = introProgress(frame);
  const second = Math.floor(frame / fps);
  const inSecond = (frame % fps) / fps;
  const count = SEGMENTS - second;

  const ringOut = interpolate(frame, [R, R + 8], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const detail = exitOpacity(frame, 3);
  const pop =
    frame < R ? interpolate(frame % fps, [0, 6], [1.06, 1], CLAMP) : 1;
  const captionOpacity = interpolate(frame, [R + 6, R + 16], [0, 1], CLAMP);

  const span = 360 / SEGMENTS;
  const draining = SEGMENTS - 1 - second;

  return (
    <AbsoluteFill style={{ backgroundColor: C.background }}>
      <AbsoluteFill
        style={{
          opacity: intro * (1 - ringOut),
          transform: `scale(${1 + ringOut * 0.25})`,
        }}
      >
        <svg width={width} height={height}>
          {/* Outer tick circle */}
          {Array.from({ length: OUTER_TICKS }).map((_, i) => {
            const major = i % 6 === 0;
            const [x1, y1] = polar(cx, cy, ringRadius + 70, i * 6);
            const [x2, y2] = polar(
              cx,
              cy,
              ringRadius + (major ? 110 : 90),
              i * 6,
            );
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={major ? C.secondary : C.muted}
                strokeWidth={LINE_WIDTH.micro}
              />
            );
          })}
          {/* Inner hairline */}
          <circle
            cx={cx}
            cy={cy}
            r={ringRadius - 60}
            fill="none"
            stroke={C.dim}
            strokeWidth={LINE_WIDTH.micro}
          />
          {/* Segments */}
          {Array.from({ length: SEGMENTS }).map((_, i) => {
            const from = i * span + GAP_DEG / 2;
            const to = (i + 1) * span - GAP_DEG / 2;
            let end = to;
            if (frame >= R || i > draining) end = from;
            else if (i === draining) end = from + (to - from) * (1 - inSecond);
            return (
              <g key={i}>
                <path
                  d={arc(cx, cy, ringRadius, from, to)}
                  stroke={C.dim}
                  strokeWidth={16}
                  fill="none"
                />
                {end - from > 0.2 ? (
                  <path
                    d={arc(cx, cy, ringRadius, from, end)}
                    stroke={i === draining ? C.accent : C.primary}
                    strokeWidth={16}
                    fill="none"
                  />
                ) : null}
              </g>
            );
          })}
        </svg>
      </AbsoluteFill>

      {/* Labels around the number */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          opacity: intro * detail,
        }}
      >
        <Label
          size="secondary"
          color={C.secondary}
          tracking={3}
          style={{ position: "absolute", top: cy - numberSize * 0.62 - 60 }}
        >
          T-MINUS
        </Label>
        <Label
          size="secondary"
          color={C.secondary}
          tracking={3}
          style={{ position: "absolute", top: cy + numberSize * 0.5 + 40 }}
        >
          SECONDS
        </Label>
      </AbsoluteFill>

      {/* Countdown number */}
      {frame < R ? (
        <AbsoluteFill
          style={{
            justifyContent: "center",
            alignItems: "center",
            opacity: intro,
          }}
        >
          <div
            style={{
              fontFamily: TYPOGRAPHY.family,
              fontWeight: TYPOGRAPHY.weights.bold,
              fontVariantNumeric: TYPOGRAPHY.numeric,
              fontSize: numberSize,
              lineHeight: 1,
              color: C.primary,
              transform: `scale(${pop})`,
            }}
          >
            {count}
          </div>
        </AbsoluteFill>
      ) : null}

      {/* Final */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <YearReveal fontSize={yearSize} />
        <Label
          size="heading"
          tracking={4}
          style={{
            position: "absolute",
            top: cy + yearSize * 0.5 + 90,
            opacity: captionOpacity,
          }}
        >
          HAPPY NEW YEAR
        </Label>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

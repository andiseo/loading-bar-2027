import React from "react";
import {
  AbsoluteFill,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BATCH3 } from "../../styles/layout";
import { useTheme } from "../../styles/theme";
import { TYPOGRAPHY } from "../../styles/typography";
import { CLAMP, introProgress, pad } from "../anim";
import { Label } from "../Label";
import { polar } from "./geom";
import { HudYear, useHudExit, useOutro, part, useIdle } from "./HudYear";

const DOTS = 72;
const HEAD = 5;

// A ring of 72 dots lights up clockwise to 100% just before 5s. The percent
// in the middle gives way to 2027 inside the completed ring.
export const DotRingScene: React.FC<{ radius: number; yearSize: number }> = ({
  radius,
  yearSize,
}) => {
  const C = useTheme();
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const K = BATCH3.keyFrame;
  const fillEnd = K - BATCH3.lead;
  const intro = introProgress(frame);
  const outro = useOutro();
  // Idle motion during the hold (slow, keeps running into the outro).
  const idle = useIdle();
  const exit = useHudExit();

  const progress = interpolate(frame, [0, fillEnd], [0, 1], CLAMP);
  const lit = Math.floor(progress * DOTS);
  const percent = Math.round(progress * 100);
  const cx = width / 2;
  const cy = height / 2;

  return (
    <AbsoluteFill style={{ backgroundColor: C.background }}>
      <svg
        width={width}
        height={height}
        style={{
          position: "absolute",
          opacity: intro * (1 - part(outro, 0.5, 1)),
        }}
      >
        <circle
          cx={cx}
          cy={cy}
          r={radius - 80}
          fill="none"
          stroke={C.secondary}
          strokeWidth={3}
        />
        {Array.from({ length: DOTS }).map((_, i) => {
          const [x, y] = polar(cx, cy, radius, (i / DOTS) * 360);
          // Outro: dots switch off again, last one first.
          const on =
            (i < lit || frame >= fillEnd) &&
            i < DOTS - Math.floor(part(outro, 0, 0.8) * DOTS);
          const head = on && i >= lit - HEAD && frame < fillEnd;
          // Idle: a short bright run keeps circling the full ring.
          const runIdx = Math.floor((idle * 30) / 5) % DOTS;
          const runner = frame > K && on && (runIdx - i + DOTS) % DOTS < 4;
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={head || runner ? 16 : 12}
              fill={on ? (head || runner ? C.text : C.primary) : C.dim}
            />
          );
        })}
        {/* Quarter markers outside the ring */}
        {[0, 90, 180, 270].map((a) => {
          const [x1, y1] = polar(cx, cy, radius + 60, a);
          const [x2, y2] = polar(cx, cy, radius + 110, a);
          const reached =
            progress >= a / 360 + (a === 0 ? 0 : 0.0001) || frame >= fillEnd;
          return (
            <line
              key={a}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={reached ? C.accent : C.muted}
              strokeWidth={6}
            />
          );
        })}
      </svg>

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          opacity: intro * exit,
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 30,
          }}
        >
          <Label size="secondary" tracking={4} color={C.secondary}>
            LOADING
          </Label>
          <div
            style={{
              fontFamily: TYPOGRAPHY.family,
              fontWeight: TYPOGRAPHY.weights.medium,
              fontVariantNumeric: TYPOGRAPHY.numeric,
              fontSize: 200,
              lineHeight: 1,
              color: C.text,
            }}
          >
            {pad(percent, 3)}%
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <HudYear fontSize={yearSize} outWindow={[0, 0.5]} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

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
import { TYPOGRAPHY } from "../../styles/typography";
import { CLAMP, introProgress } from "../anim";
import { Label } from "../Label";
import { polar } from "./geom";
import { HudYear, useHudExit, useOutro, part, useIdle } from "./HudYear";

const RING_TEXT = "NEW YEAR • 2027 • NEW YEAR • 2027 • NEW YEAR • 2027 • ";

// A ring of text spins and slows to a stop exactly at 5s while an inner
// tick ring counts the run-up; 2027 lands in the centre.
export const TextRingScene: React.FC<{ radius: number; yearSize: number }> = ({
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
  const exit = useHudExit();

  // Rotation decelerates to zero speed at the key frame.
  const rot = interpolate(frame, [0, K], [-200, 0], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const rotIdle = rot + idle * 8;
  const counterRot = -rotIdle * 0.6;
  const ticksOn = Math.floor(
    interpolate(frame, [0, K - BATCH3.lead], [0, 60], CLAMP),
  );
  const cx = width / 2;
  const cy = height / 2;
  const textR = radius;
  const circlePath = `M ${cx} ${cy - textR} a ${textR} ${textR} 0 1 1 0 ${2 * textR} a ${textR} ${textR} 0 1 1 0 ${-2 * textR}`;

  return (
    <AbsoluteFill style={{ backgroundColor: C.background }}>
      <svg
        width={width}
        height={height}
        style={{
          position: "absolute",
          opacity: intro * (1 - part(outro, 0.2, 1)),
          transform: `scale(${1 + 0.25 * outro})`,
        }}
      >
        <defs>
          <path id="ring-text-path" d={circlePath} />
        </defs>
        {/* Outro: the text ring spins away, growing and fading */}
        <g transform={`rotate(${rotIdle + outro * 240} ${cx} ${cy})`}>
          <text
            fill={C.primary}
            style={{
              fontFamily: TYPOGRAPHY.family,
              fontWeight: TYPOGRAPHY.weights.medium,
              fontSize: 64,
              letterSpacing: 10,
            }}
          >
            <textPath
              href="#ring-text-path"
              textLength={2 * Math.PI * textR - 20}
              lengthAdjust="spacing"
            >
              {RING_TEXT}
            </textPath>
          </text>
        </g>
        {/* Outer dashed ring, turning the other way */}
        <g transform={`rotate(${counterRot} ${cx} ${cy})`}>
          <circle
            cx={cx}
            cy={cy}
            r={radius + 90}
            fill="none"
            stroke={C.secondary}
            strokeWidth={4}
            strokeDasharray="4 22"
          />
        </g>
        {/* Inner tick ring: 60 ticks light up during the run-up */}
        {Array.from({ length: 60 }).map((_, i) => {
          const [x1, y1] = polar(cx, cy, radius - 90, i * 6);
          const [x2, y2] = polar(
            cx,
            cy,
            radius - (i % 5 === 0 ? 140 : 115),
            i * 6,
          );
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={i < ticksOn ? C.primary : C.dim}
              strokeWidth={i % 5 === 0 ? 6 : 3}
            />
          );
        })}
        {/* Orange index mark at the top */}
        <circle cx={cx} cy={cy - radius - 90} r={14} fill={C.accent} />
      </svg>

      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          opacity: intro * exit,
        }}
      >
        <Label size="heading" tracking={6} color={C.secondary}>
          STAND BY
        </Label>
      </AbsoluteFill>

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <HudYear fontSize={yearSize} outScale={0.8} outWindow={[0, 0.6]} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

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
import { part, useOutro, useIdle } from "./HudYear";
import { arc, polar } from "./geom";

const FROM_YEAR = 2020;
const TO_YEAR = 2030;
const TARGET = 2027;
const START = -125;
const END = 125;
const angleFor = (year: number) =>
  START + ((year - FROM_YEAR) / (TO_YEAR - FROM_YEAR)) * (END - START);

// A year gauge from 2020 to 2030. The needle sweeps and settles on 2027
// exactly at 5s; the digital readout lands on 2027 at the same moment.
export const GaugeDialScene: React.FC<{
  radius: number;
  readoutSize: number;
}> = ({ radius, readoutSize }) => {
  const C = useTheme();
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const K = BATCH3.keyFrame;
  const intro = introProgress(frame);
  const outro = useOutro();
  // Idle motion during the hold (slow, keeps running into the outro).
  const idle = useIdle();

  const sweep = interpolate(frame, [8, K], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });
  // Outro: the needle drops back to the start of the scale.
  const year =
    FROM_YEAR + (TARGET - FROM_YEAR) * sweep * (1 - part(outro, 0, 0.75));
  const needle = angleFor(year);
  const shown = frame >= K ? TARGET : Math.min(TARGET - 1, Math.floor(year));
  const landed = frame >= K;
  const glow = interpolate(frame, [K - 8, K], [0, 1], CLAMP);

  const cx = width / 2;
  const cy = height / 2 + 120;
  const r = radius;
  const [nx, ny] = polar(cx, cy, r - 90, needle);
  const [tx, ty] = polar(cx, cy, r + 46, angleFor(TARGET));

  return (
    <AbsoluteFill style={{ backgroundColor: C.background }}>
      <svg
        width={width}
        height={height}
        style={{
          position: "absolute",
          opacity: intro * (1 - part(outro, 0.55, 1)),
        }}
      >
        {/* Track and active arc */}
        <path
          d={arc(cx, cy, r, START, END)}
          stroke={C.dim}
          strokeWidth={22}
          fill="none"
        />
        <path
          d={arc(cx, cy, r, START, Math.max(START + 0.1, needle))}
          stroke={C.primary}
          strokeWidth={22}
          fill="none"
        />
        {/* Idle: a soft light sweeps along the scale; the needle stays on 27 */}
        {frame > K ? (
          <path
            d={arc(
              cx,
              cy,
              r,
              Math.max(START, START + ((idle * 45) % (END - START)) - 8),
              Math.min(END, START + ((idle * 45) % (END - START)) + 8),
            )}
            stroke={C.text}
            strokeWidth={30}
            fill="none"
            opacity={0.85 * Math.min(1, idle * 4)}
          />
        ) : null}
        <path
          d={arc(cx, cy, r - 150, START, END)}
          stroke={C.dim}
          strokeWidth={3}
          fill="none"
        />

        {/* Ticks: one major per year, four minor between */}
        {Array.from({ length: (TO_YEAR - FROM_YEAR) * 5 + 1 }).map((_, i) => {
          const y = FROM_YEAR + i / 5;
          const major = i % 5 === 0;
          const a = angleFor(y);
          const [x1, y1] = polar(cx, cy, r - 40, a);
          const [x2, y2] = polar(cx, cy, r - (major ? 110 : 70), a);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={y <= year + 0.001 ? C.primary : C.muted}
              strokeWidth={major ? 6 : 3}
            />
          );
        })}

        {/* Target marker (orange) on 2027 */}
        <polygon
          points={`${tx},${ty} ${tx - 22},${ty - 40} ${tx + 22},${ty - 40}`}
          transform={`rotate(${angleFor(TARGET)} ${tx} ${ty})`}
          fill={C.accent}
        />

        {/* Needle */}
        <line
          x1={cx}
          y1={cy}
          x2={nx}
          y2={ny}
          stroke={C.text}
          strokeWidth={8}
          strokeLinecap="round"
        />
        <circle
          cx={cx}
          cy={cy}
          r={34}
          fill={C.background}
          stroke={C.primary}
          strokeWidth={6}
        />
        <circle cx={cx} cy={cy} r={10} fill={landed ? C.accent : C.primary} />
      </svg>

      {/* Year labels around the dial */}
      <AbsoluteFill style={{ opacity: intro * (1 - part(outro, 0, 0.5)) }}>
        {Array.from({ length: TO_YEAR - FROM_YEAR + 1 }).map((_, i) => {
          const y = FROM_YEAR + i;
          const [lx, ly] = polar(cx, cy, r - 190, angleFor(y));
          const isTarget = y === TARGET;
          return (
            <Label
              key={y}
              size="secondary"
              weight={isTarget ? "bold" : "medium"}
              color={isTarget ? C.accent : y <= year ? C.text : C.muted}
              style={{
                position: "absolute",
                left: lx,
                top: ly,
                transform: "translate(-50%, -50%)",
              }}
            >
              {String(y).slice(2)}
            </Label>
          );
        })}

        {/* Digital readout */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: cy + 110,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 30,
          }}
        >
          <Label
            size="secondary"
            tracking={4}
            color={landed ? C.accent : C.secondary}
          >
            {landed ? "YEAR SET" : "YEAR INDEX"}
          </Label>
          <div
            style={{
              fontFamily: TYPOGRAPHY.family,
              fontWeight: TYPOGRAPHY.weights.bold,
              fontVariantNumeric: TYPOGRAPHY.numeric,
              fontSize: readoutSize,
              lineHeight: 1,
              color: landed ? C.text : C.primary,
              textShadow: C.glow(glow),
            }}
          >
            {shown}
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

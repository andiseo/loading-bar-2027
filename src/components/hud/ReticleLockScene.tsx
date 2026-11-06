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
import { CLAMP, introProgress, pad } from "../anim";
import { Label } from "../Label";
import { polar } from "./geom";
import { HudYear, useHudExit, useOutro, part, useIdle } from "./HudYear";

// Path the reticle searches along before locking on centre (offsets in px).
const PATH_FRAMES = [0, 45, 90, 132];
const PATH_X = [-980, 760, -420, 0];
const PATH_Y = [-360, 300, 380, 0];

// A circular targeting reticle sweeps the screen, locks on centre just
// before 5s and 2027 appears inside it.
export const ReticleLockScene: React.FC<{
  radius: number;
  yearSize: number;
}> = ({ radius, yearSize }) => {
  const C = useTheme();
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const K = BATCH3.keyFrame;
  const intro = introProgress(frame);
  const outro = useOutro();
  // Idle motion during the hold (slow, keeps running into the outro).
  const idle = useIdle();
  const exit = useHudExit();

  const ease = { ...CLAMP, easing: Easing.inOut(Easing.cubic) };
  const x = interpolate(frame, PATH_FRAMES, PATH_X, ease);
  const y = interpolate(frame, PATH_FRAMES, PATH_Y, ease);
  const lock = interpolate(frame, [132, K - 2], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.back(2)),
  });
  const scale = interpolate(lock, [0, 1], [1.18, 1]);
  const spin =
    idle * 18 +
    interpolate(frame, [0, K - 6], [0, 220], {
      ...CLAMP,
      easing: Easing.out(Easing.quad),
    });
  const locked = frame >= K - 4;

  const cx = width / 2;
  const cy = height / 2;
  const r = radius;

  return (
    <AbsoluteFill style={{ backgroundColor: C.background }}>
      {/* Dot grid */}
      <svg
        width={width}
        height={height}
        style={{
          position: "absolute",
          opacity: intro * (1 - part(outro, 0.4, 1)),
        }}
      >
        <defs>
          <pattern
            id="dots"
            width={120}
            height={120}
            patternUnits="userSpaceOnUse"
          >
            <circle cx={60} cy={60} r={3} fill={C.dim} />
          </pattern>
        </defs>
        <rect width={width} height={height} fill="url(#dots)" />
        {/* Crosshair guide lines following the reticle */}
        <line
          x1={0}
          y1={cy + y}
          x2={width}
          y2={cy + y}
          stroke={C.dim}
          strokeWidth={2}
          opacity={exit}
        />
        <line
          x1={cx + x}
          y1={0}
          x2={cx + x}
          y2={height}
          stroke={C.dim}
          strokeWidth={2}
          opacity={exit}
        />
      </svg>

      <svg
        width={width}
        height={height}
        style={{
          position: "absolute",
          opacity: intro * (1 - part(outro, 0.2, 1)),
        }}
        viewBox={`${-cx} ${-cy} ${width} ${height}`}
      >
        <g
          transform={`translate(${x} ${y}) scale(${scale * (1 + 0.6 * outro)})`}
        >
          <circle r={r} fill="none" stroke={C.primary} strokeWidth={6} />
          <g transform={`rotate(${spin})`}>
            <circle
              r={r - 70}
              fill="none"
              stroke={C.secondary}
              strokeWidth={4}
              strokeDasharray="60 28"
            />
          </g>
          {/* Cross ticks with a gap in the middle */}
          {[0, 90, 180, 270].map((a) => {
            const [x1, y1] = polar(0, 0, r + 70, a);
            const [x2, y2] = polar(0, 0, r - 30, a);
            return (
              <line
                key={a}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={C.primary}
                strokeWidth={6}
              />
            );
          })}
          {/* Corner brackets */}
          {[45, 135, 225, 315].map((a) => {
            const [bx, by] = polar(0, 0, r + 110, a);
            const sx = Math.sign(bx);
            const sy = Math.sign(by);
            return (
              <path
                key={a}
                d={`M ${bx - sx * 70} ${by} L ${bx} ${by} L ${bx} ${by - sy * 70}`}
                fill="none"
                stroke={locked ? C.accent : C.secondary}
                strokeWidth={5}
              />
            );
          })}
          <circle r={10} fill={locked ? C.accent : C.primary} opacity={exit} />
        </g>
      </svg>

      {/* Tracking readout */}
      <AbsoluteFill style={{ opacity: intro }}>
        <div
          style={{
            position: "absolute",
            left: 220,
            top: 200,
            display: "flex",
            flexDirection: "column",
            gap: 24,
            opacity: exit,
          }}
        >
          <Label size="heading" tracking={2} color={C.text}>
            TRACKING
          </Label>
          <Label size="secondary" color={C.secondary}>
            X {x >= 0 ? "+" : "-"}
            {pad(Math.abs(Math.round(x)), 4)} Y {y >= 0 ? "+" : "-"}
            {pad(Math.abs(Math.round(y)), 4)}
          </Label>
        </div>
        <Label
          size="heading"
          tracking={4}
          color={C.accent}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: cy + r + 170,
            textAlign: "center",
            opacity: locked ? 1 - part(outro, 0, 0.4) : 0,
          }}
        >
          TARGET LOCKED
        </Label>
      </AbsoluteFill>

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <HudYear fontSize={yearSize} outScale={0.85} outWindow={[0, 0.6]} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

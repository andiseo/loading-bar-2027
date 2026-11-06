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
import { HudYear, useHudExit, useOutro, part, useIdle } from "./HudYear";

const MERIDIANS = 8;
const LATITUDES = [-60, -30, 0, 30, 60];
const ORBIT_TILT = -14;

// A wireframe globe spins with a satellite on a tilted orbit. Both come to
// rest at 5s, the globe dims and 2027 lands in front of it.
export const WireGlobeScene: React.FC<{ radius: number; yearSize: number }> = ({
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
  const cx = width / 2;
  const cy = height / 2;
  const r = radius;

  // Outro adds a fast spin while the globe shrinks to a point.
  const spin =
    outro * 360 +
    idle * 14 +
    interpolate(frame, [0, K], [0, 150], {
      ...CLAMP,
      easing: Easing.out(Easing.cubic),
    });
  const sat =
    idle * 16 +
    interpolate(frame, [0, K], [200, 520], {
      ...CLAMP,
      easing: Easing.out(Easing.cubic),
    });
  const dimGlobe = interpolate(frame, [K - BATCH3.lead, K], [1, 0.35], CLAMP);
  const sync = Math.round(
    interpolate(frame, [0, K - BATCH3.lead], [0, 100], CLAMP),
  );

  const orbitRx = r * 1.5;
  const orbitRy = r * 0.32;
  const satRad = (sat * Math.PI) / 180;
  const sx = orbitRx * Math.cos(satRad);
  const sy = orbitRy * Math.sin(satRad);
  const satBehind = Math.sin(satRad) < 0;

  const orbit = (part: "back" | "front") => (
    <g transform={`translate(${cx} ${cy}) rotate(${ORBIT_TILT})`}>
      <path
        d={
          part === "back"
            ? `M ${-orbitRx} 0 A ${orbitRx} ${orbitRy} 0 0 1 ${orbitRx} 0`
            : `M ${orbitRx} 0 A ${orbitRx} ${orbitRy} 0 0 1 ${-orbitRx} 0`
        }
        fill="none"
        stroke={C.secondary}
        strokeWidth={part === "back" ? 2 : 4}
        opacity={part === "back" ? 0.5 : 1}
      />
      {(part === "back") === satBehind ? (
        <circle cx={sx} cy={sy} r={18} fill={C.text} />
      ) : null}
    </g>
  );

  return (
    <AbsoluteFill style={{ backgroundColor: C.background }}>
      <svg
        width={width}
        height={height}
        style={{
          position: "absolute",
          opacity: intro * (1 - part(outro, 0.5, 1)),
          transform: `scale(${1 - 0.9 * outro})`,
        }}
      >
        {orbit("back")}
        <g opacity={dimGlobe}>
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill={C.background}
            stroke={C.primary}
            strokeWidth={6}
          />
          {/* Meridians: ellipses whose width follows the spin */}
          {Array.from({ length: MERIDIANS }).map((_, i) => {
            const a = ((spin + (i * 180) / MERIDIANS) * Math.PI) / 180;
            const rx = Math.abs(Math.cos(a)) * r;
            return (
              <ellipse
                key={i}
                cx={cx}
                cy={cy}
                rx={rx}
                ry={r}
                fill="none"
                stroke={C.primary}
                strokeWidth={3}
                opacity={0.75}
              />
            );
          })}
          {/* Latitudes */}
          {LATITUDES.map((lat) => {
            const y = cy - r * Math.sin((lat * Math.PI) / 180);
            const w = r * Math.cos((lat * Math.PI) / 180);
            return (
              <ellipse
                key={lat}
                cx={cx}
                cy={y}
                rx={w}
                ry={w * 0.12}
                fill="none"
                stroke={C.secondary}
                strokeWidth={3}
                opacity={0.8}
              />
            );
          })}
        </g>
        <g opacity={interpolate(dimGlobe, [0.35, 1], [0.3, 1])}>
          {orbit("front")}
        </g>
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
            GLOBAL SYNC
          </Label>
          <Label size="secondary" color={C.secondary}>
            SYNC {pad(sync, 3)}%
          </Label>
        </div>
        <div
          style={{
            position: "absolute",
            right: 220,
            bottom: 200,
            opacity: exit,
          }}
        >
          <Label size="secondary" color={C.secondary} tracking={2}>
            ALL TIME ZONES
          </Label>
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <HudYear fontSize={yearSize} outWindow={[0, 0.5]} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

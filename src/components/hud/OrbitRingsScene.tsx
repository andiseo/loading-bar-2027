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
import { arc, polar } from "./geom";
import { HudYear, useHudExit, useOutro, part, useIdle } from "./HudYear";

type Ring = {
  from: number; // start radius
  to: number; // final radius around 2027
  arcs: [number, number][]; // visible arc spans in degrees
  turns: number; // total rotation (deg) until the key frame, sign = direction
  width: number;
};

const RINGS: Ring[] = [
  {
    from: 260,
    to: 560,
    arcs: [
      [0, 80],
      [120, 160],
      [200, 300],
    ],
    turns: 300,
    width: 10,
  },
  {
    from: 520,
    to: 640,
    arcs: [
      [20, 140],
      [180, 200],
      [230, 340],
    ],
    turns: -220,
    width: 5,
  },
  {
    from: 800,
    to: 720,
    arcs: [
      [0, 40],
      [60, 170],
      [190, 230],
      [260, 350],
    ],
    turns: 160,
    width: 3,
  },
];

// Three broken rings spin in opposite directions, then settle into a tight
// concentric frame around 2027 at 5s. Each ring carries an orbiting dot.
export const OrbitRingsScene: React.FC<{ yearSize: number }> = ({
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

  const spin = interpolate(frame, [0, K], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const gather = interpolate(frame, [K - 40, K], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });

  return (
    <AbsoluteFill style={{ backgroundColor: C.background }}>
      <svg
        width={width}
        height={height}
        style={{
          position: "absolute",
          opacity: intro * (1 - part(outro, 0.3, 1)),
        }}
      >
        {RINGS.map((ring, i) => {
          // Outro: rings fling outward while spinning on.
          const r =
            interpolate(gather, [0, 1], [ring.from, ring.to]) +
            outro * (500 + i * 250);
          const rot =
            ring.turns * (spin + outro * 0.6) +
            Math.sign(ring.turns) * idle * (14 - i * 3);
          const [dx, dy] = polar(cx, cy, r, rot + 100 + i * 90);
          return (
            <g key={i}>
              {ring.arcs.map(([a, b], k) => (
                <path
                  key={k}
                  d={arc(cx, cy, r, a + rot, b + rot)}
                  stroke={i === 0 ? C.primary : C.secondary}
                  strokeWidth={ring.width}
                  strokeLinecap="round"
                  fill="none"
                />
              ))}
              <circle cx={dx} cy={dy} r={14} fill={C.text} />
            </g>
          );
        })}
        {/* Faint full guide circle */}
        <circle
          cx={cx}
          cy={cy}
          r={900}
          fill="none"
          stroke={C.dim}
          strokeWidth={2}
        />
      </svg>

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
          <Label size="heading" tracking={2} color={C.text}>
            ORBIT SYNC
          </Label>
          <Label size="secondary" color={C.secondary}>
            3 RINGS ALIGNING
          </Label>
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <HudYear fontSize={yearSize} outWindow={[0, 0.6]} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BATCH3, LINE_WIDTH } from "../../styles/layout";
import { useTheme } from "../../styles/theme";
import { TYPOGRAPHY } from "../../styles/typography";
import { CLAMP, introProgress } from "../anim";
import { Label } from "../Label";
import { polar } from "./geom";
import { HudYear, useHudExit, useOutro, part } from "./HudYear";

const PING_FRAMES = 48;
const GUIDES = [260, 520, 780];

// A ping goes out every second while the core counts 5 to 1. Just before
// 5s a final strong ping clears the core and 2027 lands.
export const SonarPingScene: React.FC<{
  yearSize: number;
  countSize: number;
}> = ({ yearSize, countSize }) => {
  const C = useTheme();
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const K = BATCH3.keyFrame;
  const intro = introProgress(frame);
  const outro = useOutro();
  const exit = useHudExit();

  const cx = width / 2;
  const cy = height / 2;
  const second = Math.floor(frame / fps);
  const count = 5 - second;
  const inSecond = frame % fps;
  const pop = interpolate(inSecond, [0, 6], [1.1, 1], CLAMP);

  const pings = [0, 1, 2, 3, 4].map((i) => i * fps);
  const finalStart = K - BATCH3.lead;
  const finalP = interpolate(frame, [finalStart, K], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
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
        {/* Guide rings with cardinal ticks */}
        {GUIDES.map((r) => (
          <circle
            key={r}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={C.dim}
            strokeWidth={LINE_WIDTH.secondary}
          />
        ))}
        {[0, 90, 180, 270].map((a) => {
          const [x1, y1] = polar(cx, cy, GUIDES[2] - 30, a);
          const [x2, y2] = polar(cx, cy, GUIDES[2] + 30, a);
          return (
            <line
              key={a}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={C.secondary}
              strokeWidth={4}
            />
          );
        })}

        {/* Regular pings */}
        {pings.map((start) => {
          const local = frame - start;
          if (local < 0 || local > PING_FRAMES || frame >= K) return null;
          const p = local / PING_FRAMES;
          const r = interpolate(p, [0, 1], [120, 980], {
            easing: Easing.out(Easing.quad),
          });
          return (
            <circle
              key={start}
              cx={cx}
              cy={cy}
              r={r}
              fill="none"
              stroke={C.primary}
              strokeWidth={interpolate(p, [0, 1], [8, 2])}
              opacity={interpolate(p, [0, 1], [0.9, 0]) * exit}
            />
          );
        })}

        {/* Final ping: settles on the outer guide ring as a bright ring */}
        {frame >= finalStart ? (
          <circle
            cx={cx}
            cy={cy}
            r={interpolate(finalP, [0, 1], [140, GUIDES[2]]) + outro * 1100}
            opacity={1 - outro}
            fill="none"
            stroke={C.primary}
            strokeWidth={interpolate(finalP, [0, 1], [24, 6])}
          />
        ) : null}

        {/* Idle: faint, slower pings keep going out */}
        {[0, 1, 2, 3].map((k) => {
          const local = frame - (K + 12 + k * 40);
          if (local < 0 || local > 60) return null;
          const p = local / 60;
          return (
            <circle
              key={`idle-${k}`}
              cx={cx}
              cy={cy}
              r={interpolate(p, [0, 1], [200, GUIDES[2]])}
              fill="none"
              stroke={C.primary}
              strokeWidth={3}
              opacity={interpolate(p, [0, 0.2, 1], [0, 0.35, 0])}
            />
          );
        })}

        {/* Core */}
        <circle
          cx={cx}
          cy={cy}
          r={170}
          fill="none"
          stroke={C.secondary}
          strokeWidth={4}
          opacity={exit}
        />
        <circle cx={cx} cy={cy - GUIDES[2]} r={12} fill={C.accent} />
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
            fontFamily: TYPOGRAPHY.family,
            fontWeight: TYPOGRAPHY.weights.bold,
            fontVariantNumeric: TYPOGRAPHY.numeric,
            fontSize: countSize,
            lineHeight: 1,
            color: C.text,
            transform: `scale(${pop})`,
          }}
        >
          {Math.max(1, count)}
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ opacity: intro * (1 - part(outro, 0, 0.5)) }}>
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
            SIGNAL 2027
          </Label>
          <Label size="secondary" color={C.secondary}>
            PING {Math.min(5, second + 1)}/5
          </Label>
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <HudYear fontSize={yearSize} outScale={1.12} outWindow={[0, 0.6]} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

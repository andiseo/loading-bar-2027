import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BATCH3 } from "../../styles/layout";
import { useTheme } from "../../styles/theme";
import { TYPOGRAPHY } from "../../styles/typography";
import { CLAMP, introProgress } from "../anim";
import { part, useIdle, useOutro } from "../hud/HudYear";

const DASH = 2600;
const SPARKS = 18;

// A laser point engraves the outline of 2027 from left to right, throwing
// small sparks. The engraved number then fills with gold and is complete
// at 5s. During the hold the laser keeps tracing the outline slowly.
export const LaserEngraveScene: React.FC<{ fontSize: number }> = ({
  fontSize,
}) => {
  const C = useTheme();
  const T = C.text ?? C.primary;
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const K = BATCH3.keyFrame;
  const intro = introProgress(frame);
  const outro = useOutro();
  const idle = useIdle();

  const cx = width / 2;
  const baseline = height / 2 + fontSize * 0.36;
  const textW = fontSize * 2.45;
  const left = cx - textW / 2;

  const engrave = interpolate(frame, [6, 118], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.sin),
  });
  const fill = interpolate(frame, [118, K], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const laserX = left + engrave * textW;
  const laserY =
    baseline - fontSize * 0.36 + Math.sin(frame * 0.9) * fontSize * 0.3;
  const engraving = frame >= 6 && frame < 118;

  // Idle: a faint second pass keeps travelling along the outline.
  const idleDash = (idle * 260) % DASH;
  const outlineOut = part(outro, 0, 0.7);
  const fillOut = part(outro, 0, 0.5);

  const sparks = useMemo(
    () =>
      Array.from({ length: SPARKS }).map((_, i) => ({
        a: random(`sa${i}`) * Math.PI * 2,
        d: 40 + random(`sd${i}`) * 120,
        life: 6 + Math.floor(random(`sl${i}`) * 8),
        off: Math.floor(random(`so${i}`) * 8),
      })),
    [],
  );

  const textStyle = {
    fontFamily: TYPOGRAPHY.family,
    fontWeight: TYPOGRAPHY.weights.bold,
    fontSize,
    letterSpacing: -fontSize * 0.02,
  };

  return (
    <AbsoluteFill style={{ backgroundColor: C.background }}>
      <svg
        width={width}
        height={height}
        style={{ position: "absolute", opacity: intro }}
      >
        <defs>
          <clipPath id="engraved">
            <rect x={0} y={0} width={laserX} height={height} />
          </clipPath>
        </defs>

        {/* Gold fill, after the outline is done */}
        <text
          x={cx}
          y={baseline}
          textAnchor="middle"
          style={textStyle}
          fill={T}
          opacity={fill * (1 - fillOut)}
          filter={undefined}
        >
          2027
        </text>

        {/* Engraved outline, revealed left to right behind the laser */}
        <g clipPath={frame < 118 ? "url(#engraved)" : undefined}>
          <text
            x={cx}
            y={baseline}
            textAnchor="middle"
            style={textStyle}
            fill="none"
            stroke={C.primary}
            strokeWidth={6}
            strokeDasharray={`${DASH} ${DASH}`}
            strokeDashoffset={-outlineOut * DASH}
          >
            2027
          </text>
        </g>

        {/* Idle: a bright trace keeps running along the outline */}
        {frame > K ? (
          <text
            x={cx}
            y={baseline}
            textAnchor="middle"
            style={textStyle}
            fill="none"
            stroke={C.secondary}
            strokeWidth={8}
            strokeDasharray={`120 ${DASH}`}
            strokeDashoffset={-idleDash}
            opacity={Math.min(1, idle * 2) * (1 - outlineOut)}
          >
            2027
          </text>
        ) : null}

        {/* Laser point and sparks */}
        {engraving ? (
          <g>
            <line
              x1={laserX}
              y1={0}
              x2={laserX}
              y2={laserY}
              stroke={C.primary}
              strokeWidth={3}
              opacity={0.35}
            />
            {sparks.map((s, i) => {
              const age = (frame + s.off) % s.life;
              const p = age / s.life;
              return (
                <circle
                  key={i}
                  cx={laserX + Math.cos(s.a) * s.d * p}
                  cy={laserY + Math.sin(s.a) * s.d * p + p * p * 60}
                  r={5 * (1 - p) + 1}
                  fill={i % 3 === 0 ? C.accent : C.secondary}
                  opacity={1 - p}
                />
              );
            })}
            <circle
              cx={laserX}
              cy={laserY}
              r={22}
              fill={C.secondary}
              opacity={0.45}
            />
            <circle cx={laserX} cy={laserY} r={10} fill={C.accent} />
          </g>
        ) : null}
      </svg>
    </AbsoluteFill>
  );
};

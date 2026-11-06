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
import { part, useIdle, useOutro } from "../hud/HudYear";
import { polar } from "../hud/geom";

const TURNS = 6.5; // half-turn ends on the 2027 side

// A geometric gold coin spins, flashing 2026 and 2027, and slows to rest on
// the 2027 side exactly at 5s. During the hold it rocks gently; at the end it spins away into a point.
export const CoinSpinScene: React.FC<{ radius: number; yearSize: number }> = ({
  radius,
  yearSize,
}) => {
  const C = useTheme();
  const T = C.text ?? C.primary;
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const K = BATCH3.keyFrame;
  const intro = introProgress(frame);
  const outro = useOutro();
  const idle = useIdle();

  const spin = interpolate(frame, [0, K - 2], [0, TURNS * 360], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  // Idle: a gentle rock around the face-on position.
  const rock = Math.sin(idle * 1.6) * 14 * Math.min(1, idle * 2);
  const outSpin = part(outro, 0, 1) * 720;
  const angle = spin + rock + outSpin;
  const cos = Math.cos((angle * Math.PI) / 180);
  const scaleX = Math.max(0.02, Math.abs(cos));
  // Which side faces us: 2027 on odd half-turns.
  const half = Math.floor((angle + 90) / 180);
  const face = half % 2 === 1 ? "2027" : "2026";
  const shrink = 1 - part(outro, 0.3, 1);

  const cx = width / 2;
  const cy = height / 2;
  const edge = Math.round(36 * Math.sqrt(1 - scaleX * scaleX));

  return (
    <AbsoluteFill style={{ backgroundColor: C.background }}>
      <svg
        width={width}
        height={height}
        style={{ position: "absolute", opacity: intro * shrink }}
      >
        <g transform={`translate(${cx} ${cy}) scale(${shrink})`}>
          {/* Coin edge: a darker disc offset sideways while the coin is turned */}
          <ellipse
            cx={edge * Math.sign(cos || 1)}
            cy={0}
            rx={radius * scaleX}
            ry={radius}
            fill={C.muted}
          />
          <g transform={`scale(${scaleX} 1)`}>
            <circle
              r={radius}
              fill={C.dim}
              stroke={C.primary}
              strokeWidth={14}
            />
            <circle
              r={radius - 60}
              fill="none"
              stroke={C.secondary}
              strokeWidth={4}
            />
            {Array.from({ length: 72 }).map((_, i) => {
              const [x1, y1] = polar(0, 0, radius - 22, i * 5);
              const [x2, y2] = polar(0, 0, radius - 44, i * 5);
              return (
                <line
                  key={i}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={C.primary}
                  strokeWidth={4}
                />
              );
            })}
            <text
              x={0}
              y={yearSize * 0.36}
              textAnchor="middle"
              fill={face === "2027" ? T : C.secondary}
              style={{
                fontFamily: TYPOGRAPHY.family,
                fontWeight: TYPOGRAPHY.weights.bold,
                fontSize: yearSize,
                letterSpacing: -yearSize * 0.02,
              }}
            >
              {face}
            </text>
          </g>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

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

const BUBBLES = 26;

// 2027 drawn as an empty outline fills with liquid gold from the bottom.
// Full and glowing at 5s; small bubbles keep rising during the hold; at
// the end the gold drains away and the outline fades.
export const GoldFillScene: React.FC<{ fontSize: number }> = ({ fontSize }) => {
  const C = useTheme();
  const frame = useCurrentFrame();
  const { width, height, fps } = useVideoConfig();
  const K = BATCH3.keyFrame;
  const full = K - BATCH3.lead;
  const intro = introProgress(frame);
  const outro = useOutro();
  const idle = useIdle();

  const cx = width / 2;
  const baseline = height / 2 + fontSize * 0.36;
  const top = baseline - fontSize * 0.74;
  const bottom = baseline + 10;

  const fillIn = interpolate(frame, [6, full], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.sin),
  });
  const drain = part(outro, 0, 0.7);
  const level = fillIn * (1 - drain);
  // Surface y; overshoots the glyph top a little when full.
  const surface = bottom + 40 - (bottom - top + 80) * level;
  const t = frame / fps;
  const waveAmp = interpolate(level, [0, 0.9, 1], [22, 18, 0], CLAMP);
  const wavePath = useMemo(() => {
    return (y: number, phase: number, amp: number) => {
      const pts: string[] = [`M 0 ${height}`, `L 0 ${y}`];
      for (let x = 0; x <= width; x += 60) {
        pts.push(`L ${x} ${y + Math.sin(x / 140 + phase) * amp}`);
      }
      pts.push(`L ${width} ${height} Z`);
      return pts.join(" ");
    };
  }, [width, height]);

  const glow =
    interpolate(frame, [full, K], [0, 1], CLAMP) * (1 - part(outro, 0, 0.4));
  const bubbles = useMemo(
    () =>
      Array.from({ length: BUBBLES }).map((_, i) => ({
        x: cx - fontSize * 1.25 + random(`bx${i}`) * fontSize * 2.5,
        r: 6 + random(`br${i}`) * 10,
        speed: 0.5 + random(`bs${i}`) * 0.8,
        off: random(`bo${i}`),
      })),
    [cx, fontSize],
  );

  const textProps = {
    x: cx,
    y: baseline,
    textAnchor: "middle" as const,
    style: {
      fontFamily: TYPOGRAPHY.family,
      fontWeight: TYPOGRAPHY.weights.bold,
      fontSize,
      letterSpacing: -fontSize * 0.02,
    },
  };

  return (
    <AbsoluteFill style={{ backgroundColor: C.background }}>
      <svg
        width={width}
        height={height}
        style={{ position: "absolute", opacity: intro }}
      >
        <defs>
          <clipPath id="year-clip">
            <text {...textProps}>2027</text>
          </clipPath>
        </defs>

        {/* Liquid gold inside the digits */}
        <g clipPath="url(#year-clip)">
          <path d={wavePath(surface, t * 3, waveAmp)} fill={C.primary} />
          <path
            d={wavePath(surface + 26, t * 2.2 + 1.5, waveAmp * 0.7)}
            fill={C.secondary}
            opacity={0.25}
          />
          {/* Idle: bubbles rise slowly through the full gold */}
          {frame > K
            ? bubbles.map((b, i) => {
                const y =
                  bottom -
                  ((idle * 0.18 * b.speed + b.off) % 1) * (bottom - top);
                return (
                  <circle
                    key={i}
                    cx={b.x}
                    cy={y}
                    r={b.r}
                    fill={C.text}
                    opacity={
                      0.35 * Math.min(1, idle * 2) * (y > surface ? 1 : 0)
                    }
                  />
                );
              })
            : null}
        </g>

        {/* Outline */}
        <text
          {...textProps}
          fill="none"
          stroke={C.secondary}
          strokeWidth={5}
          opacity={1 - part(outro, 0.6, 1)}
          style={{
            ...textProps.style,
            filter:
              glow > 0
                ? `drop-shadow(0 0 ${Math.round(30 * glow)}px rgba(232,176,75,${0.7 * glow}))`
                : undefined,
          }}
        >
          2027
        </text>
      </svg>
    </AbsoluteFill>
  );
};

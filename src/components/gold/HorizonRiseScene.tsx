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

// One thin gold horizon line grows out from a point; 2027 rises from behind
// it like a sunrise and is fully up at 5s. A small glint travels along the
// line during the hold. At the end 2027 sinks back and the line shrinks to
// a point.
export const HorizonRiseScene: React.FC<{
  yearSize: number;
  lineWidth: number;
}> = ({ yearSize, lineWidth }) => {
  const C = useTheme();
  const T = C.text ?? C.primary;
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const K = BATCH3.keyFrame;
  const intro = introProgress(frame);
  const outro = useOutro();
  const idle = useIdle();

  const cx = width / 2;
  // The horizon sits a little below centre so 2027 ends up centred.
  const horizon = height / 2 + yearSize * 0.42;

  const grow = interpolate(frame, [4, 54], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });
  const rise = interpolate(frame, [48, K], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const sink = part(outro, 0, 0.55);
  const shrink = part(outro, 0.45, 1);
  const up = rise * (1 - sink);
  const lineW = lineWidth * grow * (1 - shrink);
  const glow = interpolate(frame, [K - 20, K], [0, 1], CLAMP) * (1 - sink);

  // Glyph box: the number is shifted down by its height when "below".
  const boxH = yearSize * 1.0;
  const offset = (1 - up) * boxH;

  // Idle glint drifts slowly back and forth along the line.
  const glintX = cx + Math.cos(idle * 0.9) * (lineWidth / 2 - 60);
  const glintOn = Math.min(1, idle * 2) * (1 - part(outro, 0, 0.4));

  return (
    <AbsoluteFill style={{ backgroundColor: C.background }}>
      {/* 2027, clipped at the horizon so it rises from behind the line */}
      <div
        style={{
          position: "absolute",
          left: 0,
          width,
          top: horizon - boxH - 40,
          height: boxH + 40,
          overflow: "hidden",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
          opacity: intro,
        }}
      >
        <div
          style={{
            fontFamily: TYPOGRAPHY.family,
            fontWeight: TYPOGRAPHY.weights.bold,
            fontVariantNumeric: TYPOGRAPHY.numeric,
            fontSize: yearSize,
            lineHeight: 1,
            letterSpacing: -yearSize * 0.02,
            color: T,
            transform: `translateY(${offset + yearSize * 0.12}px)`,
            textShadow: C.glow(glow),
          }}
        >
          2027
        </div>
      </div>

      <svg
        width={width}
        height={height}
        style={{ position: "absolute", opacity: intro }}
      >
        <defs>
          <linearGradient id="horizon-fade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={C.primary} stopOpacity={0} />
            <stop offset="18%" stopColor={C.primary} stopOpacity={1} />
            <stop offset="82%" stopColor={C.primary} stopOpacity={1} />
            <stop offset="100%" stopColor={C.primary} stopOpacity={0} />
          </linearGradient>
        </defs>
        {lineW > 1 ? (
          <rect
            x={cx - lineW / 2}
            y={horizon - 5}
            width={lineW}
            height={10}
            fill="url(#horizon-fade)"
          />
        ) : null}
        {/* Starting point / end point */}
        <circle
          cx={cx}
          cy={horizon}
          r={10}
          fill={T}
          opacity={
            interpolate(frame, [0, 6, 30, 54], [0, 1, 1, 0], CLAMP) +
            interpolate(outro, [0.75, 0.9, 1], [0, 1, 0], CLAMP)
          }
        />
        {/* Idle glint */}
        {frame > K ? (
          <g opacity={glintOn}>
            <ellipse
              cx={glintX}
              cy={horizon}
              rx={160}
              ry={9}
              fill={C.secondary}
              opacity={0.8}
            />
            <circle cx={glintX} cy={horizon} r={11} fill={C.accent} />
          </g>
        ) : null}
      </svg>
    </AbsoluteFill>
  );
};

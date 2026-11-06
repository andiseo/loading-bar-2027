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
import { HudYear, part, useIdle, useOutro } from "../hud/HudYear";

const BEAM_LEN = 2600;
const SPREAD = 9; // half-angle of a beam, degrees

// Two stage spotlights sweep the dark, then cross exactly on 2027 at 5s.
export const SpotlightScene: React.FC<{ yearSize: number }> = ({
  yearSize,
}) => {
  const C = useTheme();
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const K = BATCH3.keyFrame;
  const intro = introProgress(frame);
  const outro = useOutro();
  const idle = useIdle();

  const cx = width / 2;
  const cy = height / 2;
  const sources = [
    { x: 360, y: height + 40, side: -1 },
    { x: width - 360, y: height + 40, side: 1 },
  ];

  // Sweep: wide swings that settle on the centre at the key frame.
  const settle = interpolate(frame, [0, K - 4], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });
  const swing = Math.sin((frame / 30) * 2.2) * 34 * (1 - settle);
  // Idle: a slow, gentle sway that keeps the light alive.
  const sway = Math.sin(idle * 1.4) * 3 * Math.min(1, idle * 2);
  // Outro: beams narrow and switch off.
  const beamOn = 1 - part(outro, 0.2, 0.9);

  return (
    <AbsoluteFill style={{ backgroundColor: C.background }}>
      <svg
        width={width}
        height={height}
        style={{ position: "absolute", opacity: intro }}
      >
        <defs>
          <linearGradient id="beam-fade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={C.secondary} stopOpacity={0.55} />
            <stop offset="70%" stopColor={C.primary} stopOpacity={0.12} />
            <stop offset="100%" stopColor={C.primary} stopOpacity={0} />
          </linearGradient>
          <radialGradient id="pool" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor={C.secondary} stopOpacity={0.35} />
            <stop offset="100%" stopColor={C.secondary} stopOpacity={0} />
          </radialGradient>
        </defs>

        {sources.map((s, i) => {
          const toCentre = (Math.atan2(cy - s.y, cx - s.x) * 180) / Math.PI;
          const angle = toCentre + s.side * swing + (i === 0 ? sway : -sway);
          const spread = SPREAD * beamOn;
          const rad = (spread * Math.PI) / 180;
          const half = Math.tan(rad) * BEAM_LEN;
          return (
            <g
              key={i}
              transform={`translate(${s.x} ${s.y}) rotate(${angle})`}
              opacity={beamOn}
            >
              <polygon
                points={`0,-6 ${BEAM_LEN},${-half} ${BEAM_LEN},${half} 0,6`}
                fill="url(#beam-fade)"
              />
              <circle r={26} fill={C.text} />
            </g>
          );
        })}

        {/* Light pool where the beams meet */}
        <ellipse
          cx={cx}
          cy={cy}
          rx={1100}
          ry={520}
          fill="url(#pool)"
          opacity={interpolate(frame, [K - 20, K], [0, 1], CLAMP) * beamOn}
        />
      </svg>

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <HudYear fontSize={yearSize} outWindow={[0.4, 1]} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

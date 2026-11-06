import React from "react";
import { Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BATCH3 } from "../../styles/layout";
import { useTheme } from "../../styles/theme";
import { TYPOGRAPHY } from "../../styles/typography";
import { CLAMP } from "../anim";

// 0 during the hold, then 0 to 1 over the last second of the clip.
// Reaches 1 on the final frame so the clip ends on an empty frame.
export const useOutro = (easing = Easing.inOut(Easing.quad)) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  return interpolate(
    frame,
    [durationInFrames - BATCH3.outroFrames, durationInFrames - 1],
    [0, 1],
    { ...CLAMP, easing },
  );
};

// Remaps the outro to a sub-window, e.g. [0, 0.6] = first 60% of the second.
export const part = (o: number, from: number, to: number) =>
  interpolate(o, [from, to], [0, 1], CLAMP);

// 2027 that lands fully formed exactly on the key frame (5s), stays
// perfectly still during the hold, then leaves during the outro.
export const HudYear: React.FC<{
  fontSize: number;
  color?: string;
  style?: React.CSSProperties;
  // Scale 2027 reaches when it is gone, and the part of the outro it uses.
  outScale?: number;
  outWindow?: [number, number];
}> = ({ fontSize, color, style, outScale = 0.9, outWindow = [0, 0.7] }) => {
  const C = useTheme();
  const frame = useCurrentFrame();
  const outro = useOutro();
  const start = BATCH3.keyFrame - BATCH3.lead;
  if (frame < start) {
    return null;
  }
  const p = interpolate(frame, [start, BATCH3.keyFrame], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const out = part(outro, outWindow[0], outWindow[1]);
  return (
    <div
      style={{
        fontFamily: TYPOGRAPHY.family,
        fontWeight: TYPOGRAPHY.weights.bold,
        fontVariantNumeric: TYPOGRAPHY.numeric,
        fontSize,
        lineHeight: 1,
        letterSpacing: -fontSize * 0.02,
        color: color ?? C.text ?? C.primary,
        opacity: interpolate(p, [0, 0.5], [0, 1], CLAMP) * (1 - out),
        transform: `scale(${interpolate(p, [0, 1], [1.08, 1]) * interpolate(out, [0, 1], [1, outScale])})`,
        filter: `blur(${Math.round((1 - p) * 12 + out * 10)}px)`,
        textShadow: C.glow(p * (1 - out)),
        whiteSpace: "nowrap",
        ...style,
      }}
    >
      2027
    </div>
  );
};

// 1 until the reveal starts, then fades to 0 by the key frame.
export const useHudExit = () => {
  const frame = useCurrentFrame();
  return interpolate(
    frame,
    [BATCH3.keyFrame - BATCH3.lead, BATCH3.keyFrame - 4],
    [1, 0],
    CLAMP,
  );
};

// Seconds of idle motion after the key frame. Starts at zero speed exactly
// on the key frame (so the thumbnail frame is unchanged), reaches full
// speed after half a second, and keeps running through the outro.
export const useIdle = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s = (frame - BATCH3.keyFrame) / fps;
  const ramp = 0.5;
  if (s <= 0) return 0;
  return s < ramp ? (s * s) / (2 * ramp) : s - ramp / 2;
};

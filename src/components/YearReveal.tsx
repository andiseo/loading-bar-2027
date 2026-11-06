import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { useTheme } from "../styles/theme";
import { TIMING } from "../styles/layout";
import { TYPOGRAPHY } from "../styles/typography";
import { CLAMP } from "./anim";

// The year number. Already partly visible on the reveal frame itself, so the
// key moment lands exactly on the whole second.
export const YearReveal: React.FC<{
  fontSize: number;
  text?: string;
  startFrame?: number;
}> = ({ fontSize, text = "2027", startFrame = TIMING.revealFrame }) => {
  const C = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - startFrame;
  if (f < 0) {
    return null;
  }

  const s = spring({
    frame: f,
    fps,
    config: { damping: 200 },
    durationInFrames: 18,
  });
  const opacity = interpolate(f, [0, 5], [0.4, 1], CLAMP);
  const scale = interpolate(s, [0, 1], [0.94, 1]);
  const glow = interpolate(f, [2, 14], [0, 1], CLAMP);

  return (
    <div
      style={{
        fontFamily: TYPOGRAPHY.family,
        fontWeight: TYPOGRAPHY.weights.bold,
        fontVariantNumeric: TYPOGRAPHY.numeric,
        fontSize,
        lineHeight: 1,
        letterSpacing: -fontSize * 0.02,
        color: C.primary,
        opacity,
        transform: `scale(${scale})`,
        textShadow: C.glow(glow),
      }}
    >
      {text}
    </div>
  );
};

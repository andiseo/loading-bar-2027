import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { LINE_WIDTH, TIMING } from "../styles/layout";
import { useTheme } from "../styles/theme";
import { TYPOGRAPHY } from "../styles/typography";
import { CLAMP, exitOpacity, introProgress, pad } from "./anim";
import { Label } from "./Label";

// Share of the text box where the glyphs actually sit (cap height area).
const GLYPH_TOP = 0.14;
const GLYPH_BOTTOM = 0.86;
const STRIPE = 14;

// A horizontal print head moves down and lays 2027 out in thin lines.
// At 10s the lines close up into a solid number.
export const PrintScanScene: React.FC<{ yearSize: number }> = ({
  yearSize,
}) => {
  const C = useTheme();
  const frame = useCurrentFrame();
  const R = TIMING.revealFrame;
  const intro = introProgress(frame);
  const detail = exitOpacity(frame, 4);

  const progress = interpolate(frame, [0, R], [0, 1], CLAMP);
  const percent = Math.min(100, Math.floor((frame * 100) / R));
  const headY = interpolate(progress, [0, 1], [GLYPH_TOP, GLYPH_BOTTOM]);
  const reveal = frame >= R ? 1 : headY;

  const solid = interpolate(frame, [R, R + 8], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  // Stripe gap shrinks to nothing as the number turns solid.
  const gap = STRIPE * 0.75 * (1 - solid);
  const stripes = `repeating-linear-gradient(to bottom, ${C.primary} 0px, ${C.primary} ${STRIPE}px, transparent ${STRIPE}px, transparent ${STRIPE + gap}px)`;

  const boxH = yearSize;
  const headWidthPad = 160;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.background,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ position: "relative", opacity: intro }}>
        {/* Ghost outline of the full number */}
        <div
          style={{
            fontFamily: TYPOGRAPHY.family,
            fontWeight: TYPOGRAPHY.weights.bold,
            fontSize: yearSize,
            lineHeight: 1,
            letterSpacing: -yearSize * 0.02,
            color: "transparent",
            WebkitTextStroke: `3px ${C.dim}`,
            opacity: detail,
          }}
        >
          2027
        </div>
        {/* Printed part */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            fontFamily: TYPOGRAPHY.family,
            fontWeight: TYPOGRAPHY.weights.bold,
            fontSize: yearSize,
            lineHeight: 1,
            letterSpacing: -yearSize * 0.02,
            color: "transparent",
            backgroundImage: solid >= 1 ? "none" : stripes,
            backgroundColor: solid >= 1 ? C.primary : "transparent",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            clipPath: `inset(0 0 ${(1 - reveal) * 100}% 0)`,
          }}
        >
          2027
        </div>

        {/* Print head */}
        <div
          style={{
            position: "absolute",
            left: -headWidthPad,
            right: -headWidthPad,
            top: Math.round(headY * boxH),
            height: LINE_WIDTH.primary * 2,
            backgroundColor: C.accent,
            opacity: detail,
          }}
        >
          <Label
            size="secondary"
            weight="regular"
            style={{ position: "absolute", right: 0, top: -64 }}
          >
            {pad(percent, 3)}%
          </Label>
          <div
            style={{
              position: "absolute",
              left: 0,
              top: -20,
              width: LINE_WIDTH.primary * 2,
              height: 48,
              backgroundColor: C.accent,
            }}
          />
        </div>

        {/* Header and footer labels */}
        <div
          style={{
            position: "absolute",
            left: -headWidthPad,
            right: -headWidthPad,
            top: -110,
            display: "flex",
            justifyContent: "space-between",
            opacity: detail,
          }}
        >
          <Label size="heading" tracking={2}>
            PRINTING 2027
          </Label>
          <Label size="heading" color={C.secondary} weight="regular">
            LINE {pad(Math.floor(progress * 420), 3)}/420
          </Label>
        </div>
      </div>
    </AbsoluteFill>
  );
};

import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { TIMING } from "../styles/layout";
import { useTheme } from "../styles/theme";
import { TYPOGRAPHY } from "../styles/typography";
import { CLAMP, exitOpacity, introProgress, pad } from "./anim";
import { Label } from "./Label";

const Bolt: React.FC<{ color: string; size: number }> = ({ color, size }) => (
  <svg width={size * 0.62} height={size} viewBox="0 0 31 50">
    <path d="M19 0 L0 29 H13 L10 50 L31 19 H18 Z" fill={color} />
  </svg>
);

// A drawn battery charges smoothly from 0 to 100%. At 10s it is full and
// 2027 appears cut out of the fill.
export const BatteryScene: React.FC<{
  width: number;
  height: number;
  yearSize: number;
}> = ({ width, height, yearSize }) => {
  const C = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const R = TIMING.revealFrame;
  const intro = introProgress(frame);
  const detail = exitOpacity(frame, 4);

  const progress = interpolate(frame, [0, R], [0, 1], CLAMP);
  const percent = Math.min(100, Math.floor((frame * 100) / R));
  const secondsLeft = Math.max(0, Math.ceil((R - frame) / fps));

  const stroke = 14;
  const inset = 26;
  const innerW = width - 2 * (stroke + inset);
  const innerH = height - 2 * (stroke + inset);
  const nubW = 44;
  const nubH = Math.round(height * 0.34);

  const f = frame - R;
  const s =
    f >= 0
      ? spring({
          frame: f,
          fps,
          config: { damping: 200 },
          durationInFrames: 16,
        })
      : 0;
  const yearOpacity = f >= 0 ? interpolate(f, [0, 5], [0.4, 1], CLAMP) : 0;
  const doneOpacity = interpolate(frame, [R + 4, R + 12], [0, 1], CLAMP);
  // Small "full" pulse on the outline right at the reveal.
  const pulse = interpolate(frame, [R, R + 4, R + 14], [1, 1.025, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.quad),
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.background,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          position: "relative",
          opacity: intro,
          transform: `scale(${pulse})`,
        }}
      >
        {/* Labels above */}
        <div
          style={{
            position: "absolute",
            bottom: height + 70,
            left: 0,
            width,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 24,
              opacity: detail,
            }}
          >
            <Bolt color={C.primary} size={64} />
            <Label size="heading" tracking={2}>
              RECHARGING
            </Label>
          </div>
          <Label size="heading" weight="regular" style={{ opacity: detail }}>
            {pad(percent, 3)}%
          </Label>
        </div>

        {/* Battery body */}
        <div
          style={{
            position: "relative",
            width,
            height,
            border: `${stroke}px solid ${C.primary}`,
            borderRadius: 48,
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              position: "absolute",
              left: inset,
              top: inset,
              width: innerW,
              height: innerH,
              borderRadius: 24,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                bottom: 0,
                width: Math.round(progress * innerW),
                backgroundColor: C.primary,
              }}
            />
            {/* 2027 cut out of the full fill */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontFamily: TYPOGRAPHY.family,
                fontWeight: TYPOGRAPHY.weights.bold,
                fontVariantNumeric: TYPOGRAPHY.numeric,
                fontSize: yearSize,
                lineHeight: 1,
                letterSpacing: -yearSize * 0.02,
                color: C.background === "transparent" ? C.accent : C.background,
                opacity: yearOpacity,
                transform: `scale(${interpolate(s, [0, 1], [0.94, 1])})`,
              }}
            >
              2027
            </div>
          </div>
        </div>
        {/* Terminal nub */}
        <div
          style={{
            position: "absolute",
            left: width + 10,
            top: (height - nubH) / 2,
            width: nubW,
            height: nubH,
            borderRadius: "0 18px 18px 0",
            backgroundColor: C.primary,
          }}
        />

        {/* Labels below */}
        <div
          style={{
            position: "absolute",
            top: height + 60,
            left: 0,
            width,
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Label
            size="secondary"
            color={C.secondary}
            tracking={2}
            style={{ opacity: detail }}
          >
            BATTERY 2027
          </Label>
          <Label
            size="secondary"
            color={C.secondary}
            tracking={2}
            style={{ opacity: detail }}
          >
            FULL IN 00:{pad(secondsLeft, 2)}
          </Label>
        </div>
        <Label
          size="heading"
          tracking={4}
          style={{
            position: "absolute",
            top: height + 60,
            left: 0,
            width,
            textAlign: "center",
            opacity: doneOpacity,
          }}
        >
          FULLY CHARGED
        </Label>
      </div>
    </AbsoluteFill>
  );
};

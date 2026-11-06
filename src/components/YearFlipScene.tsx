import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { useTheme } from "../styles/theme";
import { LINE_WIDTH, TIMING } from "../styles/layout";
import { TYPOGRAPHY } from "../styles/typography";
import { CLAMP, introProgress, pad } from "./anim";
import { Label } from "./Label";

const MONTHS = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

// 2026 with a year timeline underneath. The marker runs JAN to DEC in 10s,
// then a scan line sweeps the last digit from 6 to 7 and the timeline resets.
export const YearFlipScene: React.FC<{
  yearSize: number;
  timelineWidth: number;
}> = ({ yearSize, timelineWidth }) => {
  const C = useTheme();
  const frame = useCurrentFrame();
  const R = TIMING.revealFrame;
  const intro = introProgress(frame);
  const after = frame >= R;

  const progress = interpolate(frame, [0, R], [0, 1], CLAMP);
  const day = after ? 1 : Math.max(1, Math.round((365 * frame) / R));

  // Scan line across the last digit. Starts one frame early so the new digit
  // is already showing on the reveal frame.
  const scan = interpolate(frame, [R - 1, R + 8], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const scanOpacity = interpolate(
    frame,
    [R - 12, R - 1, R + 8, R + 14],
    [0, 1, 1, 0],
    CLAMP,
  );
  const glow = interpolate(frame, [R + 2, R + 14], [0, 1], CLAMP);

  // Timeline: fill retracts and the marker jumps back to JAN after the reveal.
  const fillWidth = after
    ? Math.round(interpolate(frame, [R, R + 8], [timelineWidth, 0], CLAMP))
    : Math.round(progress * timelineWidth);
  const markerX = frame < R + 6 ? Math.round(progress * timelineWidth) : 0;
  const markerOpacity = interpolate(
    frame,
    [R, R + 4, R + 8, R + 14],
    [1, 0, 0, 1],
    CLAMP,
  );
  const activeMonth = after ? 0 : Math.min(11, Math.floor(progress * 12));

  const digit: React.CSSProperties = {
    fontFamily: TYPOGRAPHY.family,
    fontWeight: TYPOGRAPHY.weights.bold,
    fontVariantNumeric: TYPOGRAPHY.numeric,
    fontSize: yearSize,
    lineHeight: 1,
    color: C.primary,
    textShadow: C.glow(glow),
  };

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
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: Math.round(yearSize * 0.26),
          opacity: intro,
          transform: `translateY(${Math.round((1 - intro) * 24)}px)`,
        }}
      >
        <div style={{ display: "flex", letterSpacing: -yearSize * 0.02 }}>
          <span style={digit}>202</span>
          <span style={{ position: "relative", display: "inline-block" }}>
            <span style={{ ...digit, clipPath: `inset(0 0 0 ${scan * 100}%)` }}>
              6
            </span>
            <span
              style={{
                ...digit,
                position: "absolute",
                left: 0,
                top: 0,
                clipPath: `inset(0 ${(1 - scan) * 100}% 0 0)`,
              }}
            >
              7
            </span>
            <span
              style={{
                position: "absolute",
                left: `${scan * 100}%`,
                top: "-6%",
                height: "112%",
                width: 8,
                backgroundColor: C.accent,
                boxShadow: `0 0 32px ${C.accent}`,
                opacity: scanOpacity,
              }}
            />
          </span>
        </div>

        {/* Year timeline */}
        <div style={{ position: "relative", width: timelineWidth }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 40,
            }}
          >
            <Label size="secondary" color={C.secondary} tracking={2}>
              DAY {pad(day, 3)}
            </Label>
            <Label size="secondary" color={C.secondary} tracking={2}>
              YEAR PROGRESS
            </Label>
          </div>

          <div style={{ position: "relative", height: LINE_WIDTH.primary }}>
            <div
              style={{ position: "absolute", inset: 0, backgroundColor: C.dim }}
            />
            <div
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                height: LINE_WIDTH.primary,
                width: fillWidth,
                backgroundColor: C.primary,
              }}
            />
            {/* Month dividers */}
            {MONTHS.map((_, i) => (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: Math.round((i / 12) * timelineWidth),
                  top: -10,
                  width: LINE_WIDTH.micro,
                  height: 24,
                  backgroundColor: C.muted,
                }}
              />
            ))}
            {/* Marker */}
            <div
              style={{
                position: "absolute",
                left: markerX - 14,
                top: -34,
                width: 28,
                height: 28,
                borderRadius: 14,
                backgroundColor: C.accent,
                opacity: markerOpacity,
              }}
            />
          </div>

          <div style={{ position: "relative", height: 60, marginTop: 36 }}>
            {MONTHS.map((m, i) => (
              <Label
                key={m}
                size="micro"
                color={i === activeMonth ? C.primary : C.muted}
                style={{
                  position: "absolute",
                  left: Math.round((i / 12) * timelineWidth) + 12,
                }}
              >
                {m}
              </Label>
            ))}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

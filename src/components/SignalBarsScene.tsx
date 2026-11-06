import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { LINE_WIDTH, TIMING } from "../styles/layout";
import { useTheme } from "../styles/theme";
import { CLAMP, exitOpacity, introProgress, pad } from "./anim";
import { Label } from "./Label";
import { YearReveal } from "./YearReveal";

const BARS = 10;

// Ten stepped signal bars, one fills per second. At 10s the bars drop into
// the baseline and 2027 rises in their place.
export const SignalBarsScene: React.FC<{
  barWidth: number;
  gap: number;
  minHeight: number;
  maxHeight: number;
  yearSize: number;
}> = ({ barWidth, gap, minHeight, maxHeight, yearSize }) => {
  const C = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const R = TIMING.revealFrame;
  const intro = introProgress(frame);
  const detail = exitOpacity(frame, 6);

  const totalW = BARS * barWidth + (BARS - 1) * gap;
  const percent = Math.min(100, Math.floor((frame * 100) / R));
  const drop = interpolate(frame, [R, R + 8], [1, 0], {
    ...CLAMP,
    easing: Easing.in(Easing.cubic),
  });
  const connectedOpacity = interpolate(frame, [R + 6, R + 14], [0, 1], CLAMP);

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
          width: totalW,
          height: maxHeight,
          opacity: intro,
        }}
      >
        {/* Labels */}
        <div
          style={{
            position: "absolute",
            bottom: maxHeight + 70,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "space-between",
            opacity: detail,
          }}
        >
          <Label size="heading" tracking={2}>
            SIGNAL 2027
          </Label>
          <Label size="heading" weight="regular">
            {pad(percent, 3)}%
          </Label>
        </div>

        {/* Bars */}
        {Array.from({ length: BARS }).map((_, i) => {
          const h = Math.round(
            minHeight + ((maxHeight - minHeight) * i) / (BARS - 1),
          );
          const fill = interpolate(
            frame,
            [i * fps, (i + 1) * fps],
            [0, 1],
            CLAMP,
          );
          const active = frame >= i * fps && frame < (i + 1) * fps;
          const shownH = Math.round(h * drop);
          if (shownH < 12) {
            return null;
          }
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                left: i * (barWidth + gap),
                bottom: 0,
                width: barWidth,
                height: shownH,
                boxSizing: "border-box",
                border: `${LINE_WIDTH.secondary}px solid ${C.dim}`,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: `${fill * 100}%`,
                  backgroundColor: active ? C.accent : C.primary,
                }}
              />
            </div>
          );
        })}

        {/* Baseline */}
        <div
          style={{
            position: "absolute",
            left: -60,
            right: -60,
            bottom: -LINE_WIDTH.primary - 20,
            height: LINE_WIDTH.primary,
            backgroundColor: C.secondary,
          }}
        />

        {/* Second markers */}
        <div
          style={{
            position: "absolute",
            top: maxHeight + 60,
            left: 0,
            right: 0,
            opacity: detail,
          }}
        >
          {Array.from({ length: BARS }).map((_, i) => (
            <Label
              key={i}
              size="micro"
              color={frame >= (i + 1) * fps ? C.primary : C.muted}
              style={{
                position: "absolute",
                left: i * (barWidth + gap),
                width: barWidth,
                textAlign: "center",
              }}
            >
              {pad(i + 1, 2)}
            </Label>
          ))}
        </div>

        {/* Final */}
        <div
          style={{
            position: "absolute",
            left: -400,
            right: -400,
            bottom: 60,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <YearReveal fontSize={yearSize} />
        </div>
        <Label
          size="heading"
          tracking={4}
          color={C.accent}
          style={{
            position: "absolute",
            top: maxHeight + 60,
            left: 0,
            right: 0,
            textAlign: "center",
            opacity: connectedOpacity,
          }}
        >
          CONNECTED
        </Label>
      </div>
    </AbsoluteFill>
  );
};

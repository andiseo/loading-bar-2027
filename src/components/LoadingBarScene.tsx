import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { useTheme } from "../styles/theme";
import { LINE_WIDTH, TIMING } from "../styles/layout";
import { CLAMP, exitOpacity, introProgress, pad } from "./anim";
import { Label } from "./Label";
import { YearReveal } from "./YearReveal";

const TICKS = 40;
const MAJOR_EVERY = 10;
// What is left of the bar after it collapses: a short accent rule under 2027.
const RULE_WIDTH = 240;

const statusFor = (percent: number) => {
  if (percent < 25) return "INITIALIZING";
  if (percent < 50) return "SYNCING";
  if (percent < 75) return "COMPILING";
  if (percent < 100) return "FINALIZING";
  return "COMPLETE";
};

// Thin ruler-style loading bar. Fills 10% per second, so every whole second
// shows a round percent. At 10s it collapses into a short rule and 2027 lands.
export const LoadingBarScene: React.FC<{
  barWidth: number;
  yearSize: number;
  textScale?: number;
}> = ({ barWidth, yearSize, textScale = 1 }) => {
  const C = useTheme();
  const frame = useCurrentFrame();
  const R = TIMING.revealFrame;

  const intro = introProgress(frame);
  const progress = interpolate(frame, [0, R], [0, 1], CLAMP);
  const percent = Math.min(100, Math.floor((frame * 100) / R));
  const secondsLeft = Math.max(0, Math.ceil((R - frame) / 30));

  // Fast ease-out so the bar clears the number area within a few frames.
  const collapse = interpolate(frame, [R, R + 10], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const trackWidth = Math.round(
    interpolate(collapse, [0, 1], [barWidth, RULE_WIDTH]),
  );
  const barOffset = Math.round(collapse * yearSize * 0.62);
  const detail = exitOpacity(frame, 3);

  return (
    <AbsoluteFill style={{ backgroundColor: C.background }}>
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          opacity: intro,
          transform: `translateY(${barOffset + Math.round((1 - intro) * 24)}px)`,
        }}
      >
        <div
          style={{
            position: "relative",
            width: barWidth,
            display: "flex",
            justifyContent: "center",
          }}
        >
          {/* Labels above the bar */}
          <div
            style={{
              position: "absolute",
              bottom: 64 * textScale,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              opacity: detail,
            }}
          >
            <Label size="heading" scale={textScale} tracking={2}>
              LOADING 2027
            </Label>
            <Label size="heading" scale={textScale} weight="regular">
              {pad(percent, 3)}%
            </Label>
          </div>

          {/* Track + fill */}
          <div
            style={{
              position: "relative",
              width: trackWidth,
              height: LINE_WIDTH.primary * 2,
            }}
          >
            <div
              style={{
                position: "absolute",
                top: LINE_WIDTH.primary / 2,
                left: 0,
                right: 0,
                height: LINE_WIDTH.primary,
                backgroundColor: C.dim,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                height: LINE_WIDTH.primary * 2,
                width: Math.round(progress * trackWidth),
                backgroundColor: C.primary,
              }}
            />
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundColor: C.accent,
                opacity: collapse,
              }}
            />
            {/* Accent tip */}
            <div
              style={{
                position: "absolute",
                left: Math.round(progress * trackWidth) - LINE_WIDTH.primary,
                top: -14,
                width: LINE_WIDTH.primary,
                height: 36,
                backgroundColor: C.accent,
                opacity: detail * (progress < 1 ? 1 : 0),
              }}
            />
          </div>

          {/* Ruler ticks below the bar */}
          <div
            style={{
              position: "absolute",
              top: 28,
              left: 0,
              width: barWidth,
              height: 40,
              opacity: detail,
            }}
          >
            {Array.from({ length: TICKS + 1 }).map((_, i) => {
              const major = i % MAJOR_EVERY === 0;
              const passed = i / TICKS <= progress;
              return (
                <div
                  key={i}
                  style={{
                    position: "absolute",
                    left: Math.round(
                      (i / TICKS) * (barWidth - LINE_WIDTH.micro),
                    ),
                    top: 0,
                    width: LINE_WIDTH.micro,
                    height: major ? 36 : 14,
                    backgroundColor: passed ? C.primary : C.muted,
                  }}
                />
              );
            })}
          </div>

          {/* Status line */}
          <div
            style={{
              position: "absolute",
              top: 100 * textScale,
              left: 0,
              right: 0,
              display: "flex",
              justifyContent: "space-between",
              opacity: detail,
            }}
          >
            <Label
              size="secondary"
              scale={textScale}
              color={C.secondary}
              tracking={2}
            >
              {statusFor(percent)}
            </Label>
            <Label
              size="secondary"
              scale={textScale}
              color={C.secondary}
              weight="regular"
            >
              ETA 00:{pad(secondsLeft, 2)}
            </Label>
          </div>
        </div>
      </AbsoluteFill>

      {/* 2027 on top so the collapsing bar passes behind it */}
      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <YearReveal fontSize={yearSize} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

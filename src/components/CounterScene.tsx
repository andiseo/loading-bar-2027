import React from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { TIMING } from "../styles/layout";
import { useTheme } from "../styles/theme";
import { TYPOGRAPHY } from "../styles/typography";
import { CLAMP, exitOpacity, introProgress, pad } from "./anim";
import { Label } from "./Label";

const TARGET = 2027;

// A big counter races from 0000 and slows down to land on 2027 exactly at
// 10s. Each digit locks in place once it reaches its final value for good.
export const CounterScene: React.FC<{ digitSize: number }> = ({
  digitSize,
}) => {
  const C = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const R = TIMING.revealFrame;
  const intro = introProgress(frame);
  const detail = exitOpacity(frame, 6);

  const t = interpolate(frame, [0, R], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const value =
    frame >= R ? TARGET : Math.min(TARGET - 1, Math.floor(TARGET * t));
  const digits = pad(value, 4).split("");
  const target = String(TARGET).split("");
  // Digit i is locked when the number is already past the last moment it
  // could still change, i.e. value >= target rounded down at that place.
  const lockedAt = [2000, 2000, 2020, 2027];
  const locked = lockedAt.map((v) => value >= v);
  const secondsIn = Math.min(10, Math.floor(frame / fps));

  const f = frame - R;
  const glow = interpolate(f, [0, 12], [0, 1], CLAMP);
  const pulse = interpolate(f, [0, 3, 12], [1, 1.03, 1], CLAMP);
  const captionOpacity = interpolate(frame, [R + 6, R + 16], [0, 1], CLAMP);

  const cellW = Math.round(digitSize * 0.68);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.background,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ position: "relative", opacity: intro }}>
        <div
          style={{
            position: "absolute",
            top: -120,
            left: 0,
            right: 0,
            display: "flex",
            justifyContent: "space-between",
            opacity: detail,
          }}
        >
          <Label size="heading" tracking={2}>
            YEAR COUNTER
          </Label>
          <Label size="heading" weight="regular" color={C.secondary}>
            T+00:{pad(secondsIn, 2)}
          </Label>
        </div>

        <div style={{ display: "flex", transform: `scale(${pulse})` }}>
          {digits.map((d, i) => (
            <div
              key={i}
              style={{
                width: cellW,
                textAlign: "center",
                fontFamily: TYPOGRAPHY.family,
                fontWeight: TYPOGRAPHY.weights.bold,
                fontVariantNumeric: TYPOGRAPHY.numeric,
                fontSize: digitSize,
                lineHeight: 1,
                color: locked[i] ? C.primary : C.muted,
                textShadow: C.glow(glow),
              }}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Lock indicators under each digit */}
        <div style={{ display: "flex", marginTop: 50, opacity: detail }}>
          {target.map((_, i) => (
            <div
              key={i}
              style={{
                width: cellW,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 22,
              }}
            >
              <div
                style={{
                  width: Math.round(cellW * 0.6),
                  height: 8,
                  backgroundColor: locked[i] ? C.accent : C.dim,
                }}
              />
              <Label
                size="micro"
                color={locked[i] ? C.accent : C.muted}
                tracking={2}
              >
                {locked[i] ? "LOCKED" : "SEEKING"}
              </Label>
            </div>
          ))}
        </div>

        <Label
          size="heading"
          tracking={4}
          style={{
            position: "absolute",
            top: digitSize + 70,
            left: 0,
            right: 0,
            textAlign: "center",
            opacity: captionOpacity,
          }}
        >
          WELCOME TO THE NEW YEAR
        </Label>
      </div>
    </AbsoluteFill>
  );
};

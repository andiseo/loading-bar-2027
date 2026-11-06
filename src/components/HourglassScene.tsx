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

// Share of each bulb that holds sand.
const FILL = 0.82;

// Geometric hourglass. Sand runs out over exactly 10s next to a second
// scale, then the glass turns and clears for 2027.
export const HourglassScene: React.FC<{
  glassW: number;
  glassH: number;
  yearSize: number;
}> = ({ glassW, glassH, yearSize }) => {
  const C = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const R = TIMING.revealFrame;
  const intro = introProgress(frame);
  const detail = exitOpacity(frame, 6);

  const t = interpolate(frame, [0, R], [0, 1], CLAMP);
  const secondsLeft = Math.max(0, Math.ceil((R - frame) / fps));

  const turn = interpolate(frame, [R, R + 10], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });

  // Geometry, centred on (0, 0).
  const hw = glassW / 2;
  const hh = glassH / 2;
  const neck = 10;
  const inset = 22;
  const sh = hh - inset; // sand-usable half height
  const sw = hw - inset * 1.4;

  // Top bulb: sand is a triangle pointing at the neck. Area ~ height^2.
  const topH = sh * Math.sqrt(FILL * (1 - t));
  const topW = (sw * topH) / sh;
  const top = `${-topW},${-topH} ${topW},${-topH} 0,0`;

  // Bottom bulb: filled from the base, empty triangle left near the neck.
  const emptyH = sh * Math.sqrt(1 - FILL * t);
  const emptyW = (sw * emptyH) / sh;
  const bottom = `${-sw},${sh} ${sw},${sh} ${emptyW},${emptyH} ${-emptyW},${emptyH}`;

  const flowing = frame > 0 && frame < R;
  const pad_ = 40;
  const vbW = glassW + pad_ * 2;
  const vbH = glassH + pad_ * 2;
  const scaleX = glassW + 1400;

  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.background,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          opacity: intro * (1 - turn),
          transform: `rotate(${turn * 180}deg) scale(${1 - turn * 0.25})`,
        }}
      >
        <svg
          width={vbW}
          height={vbH}
          viewBox={`${-vbW / 2} ${-vbH / 2} ${vbW} ${vbH}`}
        >
          {/* Glass */}
          <polygon
            points={`${-hw},${-hh} ${hw},${-hh} ${neck},0 ${hw},${hh} ${-hw},${hh} ${-neck},0`}
            fill="none"
            stroke={C.secondary}
            strokeWidth={LINE_WIDTH.primary}
            strokeLinejoin="round"
          />
          {/* Sand */}
          <polygon points={top} fill={C.primary} />
          <polygon points={bottom} fill={C.primary} />
          {flowing ? (
            <line
              x1={0}
              y1={0}
              x2={0}
              y2={emptyH}
              stroke={C.accent}
              strokeWidth={LINE_WIDTH.secondary}
            />
          ) : null}
        </svg>
      </AbsoluteFill>

      {/* Caps stay put when the glass turns, then close in to frame 2027 */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          opacity: intro,
        }}
      >
        {[-1, 1].map((side) => (
          <div
            key={side}
            style={{
              position: "absolute",
              width: Math.round(
                interpolate(turn, [0, 1], [glassW + 60, yearSize * 2.6]),
              ),
              height: LINE_WIDTH.primary * 2,
              backgroundColor: C.primary,
              transform: `translateY(${Math.round(side * interpolate(turn, [0, 1], [hh, yearSize * 0.6]))}px)`,
            }}
          />
        ))}
      </AbsoluteFill>

      {/* Second scale on the right, labels on the left */}
      <AbsoluteFill
        style={{
          justifyContent: "center",
          alignItems: "center",
          opacity: intro * detail,
        }}
      >
        <div style={{ position: "relative", width: scaleX, height: glassH }}>
          {Array.from({ length: 11 }).map((_, i) => {
            const y = Math.round((i / 10) * glassH);
            const passed = 10 - i >= secondsLeft;
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  right: 0,
                  top: y,
                  display: "flex",
                  alignItems: "center",
                  gap: 24,
                  transform: "translateY(-50%)",
                }}
              >
                <div
                  style={{
                    width: i % 5 === 0 ? 56 : 28,
                    height: LINE_WIDTH.micro,
                    backgroundColor: passed ? C.primary : C.muted,
                  }}
                />
                <Label
                  size="micro"
                  color={passed ? C.primary : C.muted}
                  style={{ width: 50 }}
                >
                  {pad(10 - i, 2)}
                </Label>
              </div>
            );
          })}
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              display: "flex",
              flexDirection: "column",
              gap: 28,
            }}
          >
            <Label size="heading" tracking={2}>
              TIME TO 2027
            </Label>
            <Label size="heading" weight="regular" color={C.secondary}>
              00:{pad(secondsLeft, 2)}
            </Label>
          </div>
        </div>
      </AbsoluteFill>

      <AbsoluteFill style={{ justifyContent: "center", alignItems: "center" }}>
        <YearReveal fontSize={yearSize} />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

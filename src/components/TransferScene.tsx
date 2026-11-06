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

const PACKETS = 9;

// Packets stream from a 2026 node to a 2027 node. At 10s the 2027 node
// expands to the centre and becomes the main number.
export const TransferScene: React.FC<{
  span: number;
  node: number;
  yearSize: number;
}> = ({ span, node, yearSize }) => {
  const C = useTheme();
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const R = TIMING.revealFrame;
  const intro = introProgress(frame);
  const detail = exitOpacity(frame, 5);

  const progress = interpolate(frame, [0, R], [0, 1], CLAMP);
  const percent = Math.min(100, Math.floor((frame * 100) / R));
  const days = Math.round(365 * progress);
  const secondsLeft = Math.max(0, Math.ceil((R - frame) / fps));

  const grow = interpolate(frame, [R, R + 10], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const half = span / 2;
  const completeOpacity = interpolate(frame, [R + 6, R + 14], [0, 1], CLAMP);
  const lineStart = node / 2;
  const lineLen = span - node;

  const nodeBox = (
    label: string,
    x: number,
    highlight: boolean,
    extra?: React.CSSProperties,
    labelOpacity = 1,
  ) => (
    <div
      style={{
        position: "absolute",
        left: x - node / 2,
        top: -node / 2,
        width: node,
        height: node,
        boxSizing: "border-box",
        border: `${LINE_WIDTH.primary}px solid ${highlight ? C.accent : C.secondary}`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        ...extra,
      }}
    >
      <Label
        size="heading"
        scale={1.6}
        weight="bold"
        color={highlight ? C.primary : C.secondary}
        style={{ opacity: labelOpacity }}
      >
        {label}
      </Label>
    </div>
  );

  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.background,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{ position: "relative", width: span, height: 0, opacity: intro }}
      >
        {/* Labels */}
        <div
          style={{
            position: "absolute",
            bottom: node / 2 + 90,
            left: -node / 2,
            right: -node / 2,
            display: "flex",
            justifyContent: "space-between",
            opacity: detail,
          }}
        >
          <Label size="heading" tracking={2}>
            DATA TRANSFER
          </Label>
          <Label size="heading" weight="regular">
            {pad(percent, 3)}%
          </Label>
        </div>
        <div
          style={{
            position: "absolute",
            top: node / 2 + 70,
            left: -node / 2,
            right: -node / 2,
            display: "flex",
            justifyContent: "space-between",
            opacity: detail,
          }}
        >
          <Label size="secondary" color={C.secondary} tracking={2}>
            DAYS {pad(days, 3)}/365
          </Label>
          <Label size="secondary" color={C.secondary} tracking={2}>
            ETA 00:{pad(secondsLeft, 2)}
          </Label>
        </div>

        {/* Link line */}
        <div style={{ opacity: detail }}>
          <div
            style={{
              position: "absolute",
              left: lineStart,
              top: -LINE_WIDTH.micro / 2,
              width: lineLen,
              height: LINE_WIDTH.micro,
              backgroundColor: C.dim,
            }}
          />
          <div
            style={{
              position: "absolute",
              left: lineStart,
              top: -LINE_WIDTH.primary / 2,
              width: Math.round(lineLen * progress),
              height: LINE_WIDTH.primary,
              backgroundColor: C.primary,
            }}
          />
          {/* Packets: speed is constant so the stream reads as steady flow */}
          {frame < R
            ? Array.from({ length: PACKETS }).map((_, k) => {
                const pos =
                  ((frame * 9 + (k * lineLen) / PACKETS) % lineLen) / lineLen;
                const size = k % 3 === 0 ? 30 : 20;
                return (
                  <div
                    key={k}
                    style={{
                      position: "absolute",
                      left: Math.round(lineStart + pos * lineLen - size / 2),
                      top: -size / 2,
                      width: size,
                      height: size,
                      backgroundColor: pos < progress ? C.accent : C.primary,
                      opacity: interpolate(
                        pos,
                        [0, 0.05, 0.95, 1],
                        [0, 1, 1, 0],
                      ),
                    }}
                  />
                );
              })
            : null}
          {nodeBox("2026", 0, false)}
        </div>

        {/* 2027 node grows into the centre and fades as the number lands */}
        {nodeBox(
          "2027",
          interpolate(grow, [0, 1], [span, half]),
          true,
          {
            transform: `scale(${interpolate(grow, [0, 1], [1, 3.4])})`,
            opacity: interpolate(grow, [0, 0.6, 1], [1, 0.5, 0]),
          },
          interpolate(frame, [R, R + 2], [1, 0], CLAMP),
        )}

        <div
          style={{
            position: "absolute",
            left: half - 1500,
            width: 3000,
            top: -yearSize / 2,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <YearReveal fontSize={yearSize} />
        </div>
        <Label
          size="secondary"
          tracking={4}
          color={C.accent}
          style={{
            position: "absolute",
            left: half - 1000,
            width: 2000,
            textAlign: "center",
            top: -yearSize / 2 - 40,
            opacity: completeOpacity,
          }}
        >
          TRANSFER COMPLETE
        </Label>
      </div>
    </AbsoluteFill>
  );
};

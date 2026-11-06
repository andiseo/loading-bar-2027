import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BATCH3 } from "../../styles/layout";
import { useTheme } from "../../styles/theme";
import { TYPOGRAPHY } from "../../styles/typography";
import { CLAMP, introProgress } from "../anim";
import { Label } from "../Label";
import { part, useIdle, useOutro } from "../hud/HudYear";

const W = 2300;
const H = 900;
const STUB = 560;
const NOTCH = 60;

// A party ticket slides in and is scanned once, left to right. At 5s it reads ACCESS
// GRANTED and 2027 is printed on it. A soft shine keeps passing over the
// ticket during the hold; at the end the stub tears off and both halves go.
export const EventTicketScene: React.FC<{ yearSize: number }> = ({
  yearSize,
}) => {
  const C = useTheme();
  const T = C.text ?? C.primary;
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const K = BATCH3.keyFrame;
  const intro = introProgress(frame);
  const outro = useOutro();
  const idle = useIdle();

  const slide = interpolate(frame, [0, 24], [1, 0], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  // One smooth scan pass, left to right, finishing just before the reveal.
  const scan = interpolate(frame, [40, 132], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.sin),
  });
  const scanning = frame >= 40 && frame < 132;
  const print = interpolate(frame, [K - BATCH3.lead, K], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const granted = frame >= K - BATCH3.lead;
  // Outro: stub tears off to the right, main part drops away.
  const tear = part(outro, 0, 0.8);
  const fade = 1 - part(outro, 0.3, 1);

  const x0 = (width - W) / 2;
  const y0 = (height - H) / 2 + slide * 200;
  const mainW = W - STUB;

  const bars = useMemo(
    () =>
      Array.from({ length: 34 }).map((_, i) => ({
        w: 6 + Math.round(random(`bar${i}`) * 14),
        gap: 6 + Math.round(random(`gap${i}`) * 8),
      })),
    [],
  );

  // Outline with half-circle notches at the tear line.
  const mainPath = `M 0 0 H ${mainW - NOTCH} A ${NOTCH} ${NOTCH} 0 0 0 ${mainW + NOTCH} 0 H ${W} V ${H} H ${mainW + NOTCH} A ${NOTCH} ${NOTCH} 0 0 0 ${mainW - NOTCH} ${H} H 0 Z`;
  const shineX = ((idle * 0.35) % 1.4) * (W + 600) - 600;

  return (
    <AbsoluteFill style={{ backgroundColor: C.background }}>
      <AbsoluteFill style={{ opacity: intro * fade }}>
        <svg width={width} height={height} style={{ position: "absolute" }}>
          <defs>
            <clipPath id="ticket-clip">
              <path d={mainPath} transform={`translate(${x0} ${y0})`} />
            </clipPath>
            <linearGradient id="shine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={C.secondary} stopOpacity={0} />
              <stop offset="50%" stopColor={C.secondary} stopOpacity={0.22} />
              <stop offset="100%" stopColor={C.secondary} stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* Main part */}
          <g transform={`translate(0 ${tear * 260})`}>
            <path
              d={mainPath}
              transform={`translate(${x0} ${y0})`}
              fill={C.dim}
              fillOpacity={0.45}
              stroke={C.primary}
              strokeWidth={6}
            />
            <rect
              x={x0 + 50}
              y={y0 + 50}
              width={mainW - 100}
              height={H - 100}
              fill="none"
              stroke={C.muted}
              strokeWidth={2}
            />
            {/* Perforation */}
            <line
              x1={x0 + mainW}
              y1={y0 + NOTCH + 10}
              x2={x0 + mainW}
              y2={y0 + H - NOTCH - 10}
              stroke={C.secondary}
              strokeWidth={4}
              strokeDasharray="4 18"
              opacity={1 - tear}
            />
            {/* Idle: soft shine passes over the ticket */}
            {frame > K ? (
              <g clipPath="url(#ticket-clip)" opacity={Math.min(1, idle * 2)}>
                <rect
                  x={x0 + shineX}
                  y={y0 - 200}
                  width={420}
                  height={H + 400}
                  fill="url(#shine)"
                  transform={`rotate(18 ${x0 + shineX} ${y0 + H / 2})`}
                />
              </g>
            ) : null}
          </g>

          {/* Stub with barcode */}
          <g
            transform={`translate(${tear * 420} ${-tear * 120}) rotate(${tear * 12} ${x0 + mainW} ${y0 + H / 2})`}
          >
            {(() => {
              let bx = x0 + mainW + 90;
              return bars.map((b, i) => {
                const r = (
                  <rect
                    key={i}
                    x={bx}
                    y={y0 + 170}
                    width={b.w}
                    height={H - 340}
                    fill={i % 5 === 0 ? C.secondary : C.primary}
                  />
                );
                bx += b.w + b.gap;
                return bx < x0 + W - 70 ? r : null;
              });
            })()}
          </g>

          {/* Scan line */}
          {scanning ? (
            <line
              x1={x0 + scan * W}
              y1={y0 - 60}
              x2={x0 + scan * W}
              y2={y0 + H + 60}
              stroke={T}
              strokeWidth={8}
              opacity={0.9}
            />
          ) : null}
        </svg>

        {/* Ticket text */}
        <div
          style={{
            position: "absolute",
            left: x0,
            top: y0 + tear * 260,
            width: mainW,
            height: H,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 40,
          }}
        >
          <Label size="heading" tracking={8} color={C.secondary}>
            ADMIT ONE · NEW YEAR
          </Label>
          <div
            style={{
              fontFamily: TYPOGRAPHY.family,
              fontWeight: TYPOGRAPHY.weights.bold,
              fontVariantNumeric: TYPOGRAPHY.numeric,
              fontSize: yearSize,
              lineHeight: 1,
              letterSpacing: -yearSize * 0.02,
              color: T,
              opacity: print,
              transform: `scale(${interpolate(print, [0, 1], [1.06, 1])})`,
              filter: `blur(${Math.round((1 - print) * 10)}px)`,
              textShadow: C.glow(print),
            }}
          >
            2027
          </div>
          <Label size="heading" tracking={6} color={granted ? T : C.muted}>
            {granted ? "ACCESS GRANTED" : scanning ? "SCANNING" : "READY"}
          </Label>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

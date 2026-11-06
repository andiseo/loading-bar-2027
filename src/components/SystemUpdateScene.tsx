import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { useTheme } from "../styles/theme";
import { LINE_WIDTH, TIMING } from "../styles/layout";
import { CLAMP, exitOpacity, introProgress, pad } from "./anim";
import { Label } from "./Label";
import { YearReveal } from "./YearReveal";

const STEPS = [
  "ARCHIVING 2026",
  "CLEARING OLD CACHE",
  "INSTALLING NEW GOALS",
  "LOADING FRESH START",
  "PREPARING 2027",
];
const STEP_FRAMES = TIMING.revealFrame / STEPS.length;

const Arrow: React.FC<{ color: string }> = ({ color }) => (
  <svg width={72} height={28} viewBox="0 0 72 28">
    <path
      d="M2 14 H66 M52 3 L67 14 L52 25"
      stroke={color}
      strokeWidth={4}
      fill="none"
    />
  </svg>
);

const StepIcon: React.FC<{
  state: "done" | "active" | "pending";
  local: number;
}> = ({ state, local }) => {
  const C = useTheme();
  const size = 44;
  if (state === "done") {
    return (
      // Check is cut out of the square so it also works on a transparent background.
      <svg width={size} height={size}>
        <mask id="check-cut">
          <rect width={size} height={size} fill="white" />
          <path
            d="M11 23 L19 31 L34 14"
            stroke="black"
            strokeWidth={5}
            fill="none"
          />
        </mask>
        <rect
          width={size}
          height={size}
          fill={C.primary}
          mask="url(#check-cut)"
        />
      </svg>
    );
  }
  const inner = Math.round((size - 16) * local);
  return (
    <svg width={size} height={size}>
      <rect
        x={1.5}
        y={1.5}
        width={size - 3}
        height={size - 3}
        fill="none"
        stroke={state === "active" ? C.accent : C.muted}
        strokeWidth={3}
      />
      {state === "active" ? (
        <rect
          x={(size - inner) / 2}
          y={(size - inner) / 2}
          width={inner}
          height={inner}
          fill={C.accent}
        />
      ) : null}
    </svg>
  );
};

// Corner brackets that frame a box of the given size.
const Brackets: React.FC<{ w: number; h: number; arm: number }> = ({
  w,
  h,
  arm,
}) => {
  const C = useTheme();
  const s = LINE_WIDTH.primary;
  const corner = (
    key: string,
    pos: React.CSSProperties,
    bt: boolean,
    lr: boolean,
  ) => (
    <div
      key={key}
      style={{
        position: "absolute",
        width: arm,
        height: arm,
        ...pos,
        borderColor: C.primary,
        borderStyle: "solid",
        borderWidth: 0,
        [bt ? "borderTopWidth" : "borderBottomWidth"]: s,
        [lr ? "borderLeftWidth" : "borderRightWidth"]: s,
      }}
    />
  );
  return (
    <div style={{ position: "absolute", width: w, height: h }}>
      {corner("tl", { left: 0, top: 0 }, true, true)}
      {corner("tr", { right: 0, top: 0 }, true, false)}
      {corner("bl", { left: 0, bottom: 0 }, false, true)}
      {corner("br", { right: 0, bottom: 0 }, false, false)}
    </div>
  );
};

// Original HUD "update" panel: five playful steps, one every 2 seconds.
// At 10s the panel content clears and the brackets close in around 2027.
export const SystemUpdateScene: React.FC<{
  panelWidth: number;
  panelHeight: number;
  yearSize: number;
}> = ({ panelWidth, panelHeight, yearSize }) => {
  const C = useTheme();
  const frame = useCurrentFrame();
  const R = TIMING.revealFrame;
  const intro = introProgress(frame);
  const detail = exitOpacity(frame, 3);

  const close = interpolate(frame, [R, R + 12], [0, 1], {
    ...CLAMP,
    easing: Easing.inOut(Easing.cubic),
  });
  const finalW = Math.round(yearSize * 2.9);
  const finalH = Math.round(yearSize * 1.75);
  const w = Math.round(interpolate(close, [0, 1], [panelWidth, finalW]));
  const h = Math.round(interpolate(close, [0, 1], [panelHeight, finalH]));

  const percent = Math.min(100, Math.floor((frame * 100) / R));
  const progress = interpolate(frame, [0, R], [0, 1], CLAMP);
  const completeOpacity = interpolate(frame, [R + 4, R + 12], [0, 1], CLAMP);
  const pad_ = 110;

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
          width: w,
          height: h,
          opacity: intro,
          transform: `scale(${interpolate(intro, [0, 1], [0.97, 1])})`,
        }}
      >
        <Brackets w={w} h={h} arm={90} />

        {/* Panel content */}
        <div
          style={{
            position: "absolute",
            left: pad_,
            right: pad_,
            top: pad_,
            bottom: pad_,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            opacity: detail,
            transform: `translateY(${Math.round((1 - detail) * -20)}px)`,
          }}
        >
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Label size="heading" tracking={3}>
                SYSTEM UPDATE
              </Label>
              <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
                <Label size="heading" weight="regular" color={C.secondary}>
                  2026
                </Label>
                <Arrow color={C.accent} />
                <Label size="heading" weight="regular">
                  2027
                </Label>
              </div>
            </div>
            <div
              style={{
                height: LINE_WIDTH.micro,
                backgroundColor: C.dim,
                marginTop: 48,
              }}
            />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 44 }}>
            {STEPS.map((step, i) => {
              const start = i * STEP_FRAMES;
              const local = interpolate(
                frame,
                [start, start + STEP_FRAMES],
                [0, 1],
                CLAMP,
              );
              const state =
                frame >= start + STEP_FRAMES
                  ? "done"
                  : frame >= start
                    ? "active"
                    : "pending";
              return (
                <div
                  key={step}
                  style={{ display: "flex", alignItems: "center", gap: 40 }}
                >
                  <StepIcon state={state} local={local} />
                  <Label
                    size="body"
                    color={state === "pending" ? C.muted : C.primary}
                    tracking={1.5}
                  >
                    {step}
                  </Label>
                  <div style={{ flex: 1 }} />
                  <Label
                    size="secondary"
                    weight="regular"
                    color={
                      state === "active"
                        ? C.accent
                        : state === "done"
                          ? C.secondary
                          : C.muted
                    }
                  >
                    {state === "done"
                      ? "DONE"
                      : state === "active"
                        ? `${pad(Math.floor(local * 100), 2)}%`
                        : "QUEUED"}
                  </Label>
                </div>
              );
            })}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 48 }}>
            <div
              style={{
                position: "relative",
                flex: 1,
                height: LINE_WIDTH.primary * 2,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundColor: C.dim,
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: `${progress * 100}%`,
                  backgroundColor: C.primary,
                }}
              />
            </div>
            <Label size="heading" weight="regular">
              {pad(percent, 3)}%
            </Label>
          </div>
        </div>

        {/* Final state */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: Math.round(yearSize * 0.12),
          }}
        >
          <Label
            size="secondary"
            tracking={4}
            color={C.accent}
            style={{ opacity: completeOpacity }}
          >
            UPDATE COMPLETE
          </Label>
          <YearReveal fontSize={yearSize} />
        </div>
      </div>
    </AbsoluteFill>
  );
};

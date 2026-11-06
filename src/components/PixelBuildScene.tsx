import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
  useCurrentFrame,
} from "remotion";
import { TIMING } from "../styles/layout";
import { useTheme } from "../styles/theme";
import { CLAMP, exitOpacity, introProgress, pad } from "./anim";
import { Label } from "./Label";

// 5x7 bitmap digits, drawn for this asset.
const GLYPHS: Record<string, string[]> = {
  "2": ["01110", "10001", "00001", "00010", "00100", "01000", "11111"],
  "0": ["01110", "10001", "10001", "10001", "10001", "10001", "01110"],
  "7": ["11111", "00001", "00010", "00100", "01000", "01000", "01000"],
};
const TEXT = "2027";
const COLS = TEXT.length * 5 + (TEXT.length - 1);
const ROWS = 7;
const FLASH_FRAMES = 6;

type Cell = { col: number; row: number; on: boolean; litAt: number };

const buildCells = (): Cell[] => {
  const cells: Cell[] = [];
  TEXT.split("").forEach((ch, d) => {
    GLYPHS[ch].forEach((line, row) => {
      line.split("").forEach((bit, c) => {
        cells.push({ col: d * 6 + c, row, on: bit === "1", litAt: Infinity });
      });
    });
  });
  // Deterministic shuffle of the "on" cells. Lighting is spread evenly so
  // exactly 10% of the number is built at every whole second.
  const on = cells.filter((c) => c.on);
  const order = on
    .map((c, i) => ({ c, k: random(`pixel-${i}`) }))
    .sort((a, b) => a.k - b.k)
    .map((x) => x.c);
  order.forEach((c, i) => {
    c.litAt = Math.floor(((i + 1) / order.length) * TIMING.revealFrame) - 1;
  });
  return cells;
};

// 2027 assembled cell by cell on a dot-matrix grid. At 10s the gaps close
// and the pixels merge into one solid number.
export const PixelBuildScene: React.FC<{ cell: number; gap: number }> = ({
  cell,
  gap,
}) => {
  const C = useTheme();
  const frame = useCurrentFrame();
  const R = TIMING.revealFrame;
  const cells = useMemo(buildCells, []);
  const intro = introProgress(frame);
  const detail = exitOpacity(frame, 4);

  const merge = interpolate(frame, [R, R + 8], [0, 1], {
    ...CLAMP,
    easing: Easing.out(Easing.cubic),
  });
  const currentGap = gap * (1 - merge);
  const pitch = cell + currentGap;
  const gridW = COLS * pitch - currentGap;
  const gridH = ROWS * pitch - currentGap;

  const onCells = cells.filter((c) => c.on);
  const lit = onCells.filter((c) => frame >= c.litAt).length;
  const percent = Math.min(100, Math.round((lit / onCells.length) * 100));

  return (
    <AbsoluteFill
      style={{
        backgroundColor: C.background,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ position: "relative", opacity: intro }}>
        {/* Labels */}
        <div
          style={{
            position: "absolute",
            bottom: gridH + 90,
            left: 0,
            width: COLS * (cell + gap) - gap,
            display: "flex",
            justifyContent: "space-between",
            opacity: detail,
          }}
        >
          <Label size="heading" tracking={2}>
            BUILDING 2027
          </Label>
          <Label size="heading" weight="regular">
            {pad(percent, 3)}%
          </Label>
        </div>

        <div style={{ position: "relative", width: gridW, height: gridH }}>
          {cells.map((c, i) => {
            const isLit = c.on && frame >= c.litAt;
            const sinceLit = frame - c.litAt;
            const flashing = isLit && sinceLit < FLASH_FRAMES && frame < R;
            if (!c.on && detail <= 0) {
              return null;
            }
            return (
              <div
                key={i}
                style={{
                  position: "absolute",
                  left: Math.round(c.col * pitch),
                  top: Math.round(c.row * pitch),
                  // Overlap by 1px once merged so no seams show between cells.
                  width: Math.ceil(cell + (merge > 0.98 ? 1 : 0)),
                  height: Math.ceil(cell + (merge > 0.98 ? 1 : 0)),
                  backgroundColor: isLit
                    ? flashing
                      ? C.accent
                      : C.primary
                    : C.dim,
                  opacity: isLit ? 1 : detail,
                }}
              />
            );
          })}
        </div>

        <div
          style={{
            position: "absolute",
            top: gridH + 70,
            left: 0,
            width: COLS * (cell + gap) - gap,
            display: "flex",
            justifyContent: "space-between",
            opacity: detail,
          }}
        >
          <Label size="secondary" color={C.secondary} tracking={2}>
            PIXELS {pad(lit, 3)}/{pad(onCells.length, 3)}
          </Label>
          <Label size="secondary" color={C.secondary} tracking={2}>
            GRID {COLS}X{ROWS}
          </Label>
        </div>
      </div>
    </AbsoluteFill>
  );
};

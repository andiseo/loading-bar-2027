import { interpolate } from "remotion";
import { TIMING } from "../styles/layout";

export const CLAMP = {
  extrapolateLeft: "clamp",
  extrapolateRight: "clamp",
} as const;

// 0 to 1 over the intro.
export const introProgress = (frame: number) =>
  interpolate(frame, [0, TIMING.introFrames], [0, 1], CLAMP);

// 1 before the reveal, fading to 0 just after it.
export const exitOpacity = (frame: number, frames = 6) =>
  interpolate(
    frame,
    [TIMING.revealFrame, TIMING.revealFrame + frames],
    [1, 0],
    CLAMP,
  );

export const pad = (n: number, length: number) =>
  String(n).padStart(length, "0");

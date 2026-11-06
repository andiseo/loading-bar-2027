const FPS = 30;
// Brief allows 10 to 15 seconds. 2027 lands at 10s, then a 4s clean hold.
const DURATION_IN_SECONDS = 14;

export const CANVAS = {
  width: 3840,
  height: 2160,
  fps: FPS,
  durationInSeconds: DURATION_IN_SECONDS,
  durationInFrames: FPS * DURATION_IN_SECONDS,
} as const;

// Native 9:16 canvas for the vertical variant.
export const CANVAS_VERTICAL = {
  ...CANVAS,
  width: 2160,
  height: 3840,
} as const;

// Whole-pixel widths, sized for 4K so they survive downscaling to 1080p.
export const LINE_WIDTH = {
  primary: 4,
  secondary: 3,
  micro: 2,
} as const;

// Key moments, in frames. The year reveal sits on a whole second so buyers
// can sync it with music or a 10-second countdown.
export const TIMING = {
  revealFrame: FPS * 10,
  introFrames: 12,
} as const;

// Batch 3: short clips. 2027 is fully in place and still at 5s (likely the
// thumbnail frame), holds with no motion for at least 2s, then the last
// second is a design-specific out animation ending on an empty frame.
export const BATCH3 = {
  keyFrame: FPS * 5,
  // The reveal starts this many frames before the key frame.
  lead: 12,
  outroFrames: FPS,
  short: FPS * 8,
  long: FPS * 9,
} as const;

export const TYPOGRAPHY = {
  family: "Space Grotesk",
  weights: {
    light: 300,
    regular: 400,
    medium: 500,
    bold: 700,
  },
  // Space Grotesk is not monospace. Use this on any changing number
  // (percent, counter) so the digits keep the same width and do not jitter.
  numeric: "tabular-nums",
  // Sized for a 3840x2160 canvas.
  sizes: {
    micro: 32,
    secondary: 44,
    body: 52,
    heading: 64,
  },
  letterSpacing: 2,
} as const;

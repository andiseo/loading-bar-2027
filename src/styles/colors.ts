// Palette: cool white + ice blue on blue-black.
export const COLORS = {
  background: "#05080C",
  primary: "#F2F6FA",
  secondary: "rgba(242, 246, 250, 0.65)",
  muted: "#4E5A66",
  dim: "rgba(242, 246, 250, 0.18)",
  // Ice blue: bar tip, active ticks, and the 2027 glow.
  accent: "#7FD4FF",
  accentSoft: "rgba(127, 212, 255, 0.35)",
  transparent: "transparent",
} as const;

// Thin ice-blue glow for the 2027 reveal.
export const GLOW = "drop-shadow(0px 0px 24px rgba(127, 212, 255, 0.45))";

// Batch 3 palette A: navy + cyan, small orange markers only.
export const HUD_A = {
  background: "#020A14",
  cyan: "#3FD0FF",
  blue: "#1F6FD1",
  dim: "#0E2A44",
  muted: "#2A5578",
  text: "#E4F6FF",
  orange: "#FF9F43",
} as const;

// Batch 3 palette B: electric blue monochrome, stronger glow.
export const HUD_B = {
  background: "#01040C",
  blue: "#2F7BFF",
  light: "#7FB2FF",
  dim: "#0B1F3F",
  muted: "#25467F",
  text: "#D6E6FF",
} as const;

// Batch 4 palette: gold on warm black.
export const GOLD = {
  background: "#0A0805",
  gold: "#E8B04B",
  champagne: "#F5DFA8",
  muted: "#6B5530",
  dim: "#3A2C14",
  text: "#FFF4DC",
  sparkle: "#FFFFFF",
} as const;

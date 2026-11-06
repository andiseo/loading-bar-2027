import { createContext, useContext } from "react";
import { COLORS, GOLD, HUD_A, HUD_B } from "./colors";

export type Theme = {
  background: string;
  primary: string;
  secondary: string;
  muted: string;
  dim: string;
  accent: string;
  // Bright text colour, when it differs from the main element colour.
  text?: string;
  // Text glow for the 2027 reveal (0 = off, 1 = full). Empty string = none.
  glow: (strength: number, blur?: number) => string;
  // Optional CSS filter on the whole scene. Used on alpha so white elements
  // stay readable over light footage.
  sceneFilter?: string;
};

const iceGlow = (strength: number, blur = 48) =>
  `0 0 ${blur}px rgba(127, 212, 255, ${0.45 * strength})`;

// Original look: cool white + ice blue on blue-black.
const dark: Theme = {
  background: COLORS.background,
  primary: COLORS.primary,
  secondary: COLORS.secondary,
  muted: COLORS.muted,
  dim: COLORS.dim,
  accent: COLORS.accent,
  glow: iceGlow,
};

export const THEMES = {
  dark,
  // Same as dark, transparent background for ProRes 4444 alpha renders.
  alpha: {
    ...dark,
    background: COLORS.transparent,
    sceneFilter: "drop-shadow(0px 2px 10px rgba(5, 8, 12, 0.55))",
  },
  // Solid ice-blue background with blue-black elements and white accents.
  ice: {
    background: COLORS.accent,
    primary: COLORS.background,
    secondary: "rgba(5, 8, 12, 0.72)",
    muted: "rgba(5, 8, 12, 0.38)",
    dim: "rgba(5, 8, 12, 0.16)",
    accent: COLORS.primary,
    glow: () => "none",
  },
} satisfies Record<string, Theme>;

const ALPHA_SHADOW = "drop-shadow(0px 2px 10px rgba(2, 6, 14, 0.6))";

// Batch 3 HUD themes. Elements are coloured (cyan / electric blue), text is
// a pale blue-white.
const hudA: Theme = {
  background: HUD_A.background,
  primary: HUD_A.cyan,
  secondary: HUD_A.blue,
  muted: HUD_A.muted,
  dim: HUD_A.dim,
  accent: HUD_A.orange,
  text: HUD_A.text,
  glow: (strength, blur = 48) =>
    `0 0 ${blur}px rgba(63, 208, 255, ${0.55 * strength})`,
};

const hudB: Theme = {
  background: HUD_B.background,
  primary: HUD_B.blue,
  secondary: HUD_B.light,
  muted: HUD_B.muted,
  dim: HUD_B.dim,
  accent: HUD_B.light,
  text: HUD_B.text,
  glow: (strength, blur = 64) =>
    `0 0 ${blur}px rgba(47, 123, 255, ${0.8 * strength}), 0 0 ${Math.round(blur / 3)}px rgba(127, 178, 255, ${0.5 * strength})`,
};

// Batch 4: warm gold on warm black.
const gold: Theme = {
  background: GOLD.background,
  primary: GOLD.gold,
  secondary: GOLD.champagne,
  muted: GOLD.muted,
  dim: GOLD.dim,
  accent: GOLD.sparkle,
  text: GOLD.text,
  glow: (strength, blur = 56) =>
    `0 0 ${blur}px rgba(232, 176, 75, ${0.6 * strength}), 0 0 ${Math.round(blur / 3)}px rgba(245, 223, 168, ${0.45 * strength})`,
};

export const HUD_THEMES = {
  gold,
  goldAlpha: {
    ...gold,
    background: COLORS.transparent,
    sceneFilter: "drop-shadow(0px 2px 10px rgba(10, 8, 5, 0.6))",
  },
  hudA,
  hudAAlpha: {
    ...hudA,
    background: COLORS.transparent,
    sceneFilter: ALPHA_SHADOW,
  },
  hudB,
  hudBAlpha: {
    ...hudB,
    background: COLORS.transparent,
    sceneFilter: ALPHA_SHADOW,
  },
} satisfies Record<string, Theme>;

export type ThemeName = keyof typeof THEMES | keyof typeof HUD_THEMES;
export const ALL_THEMES: Record<ThemeName, Theme> = {
  ...THEMES,
  ...HUD_THEMES,
};

export const ThemeContext = createContext<Theme>(THEMES.dark);
export const useTheme = () => useContext(ThemeContext);

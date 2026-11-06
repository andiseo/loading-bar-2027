import React from "react";
import { useTheme } from "../styles/theme";
import { TYPOGRAPHY } from "../styles/typography";

type Size = keyof typeof TYPOGRAPHY.sizes;
type Weight = keyof typeof TYPOGRAPHY.weights;

// Uppercase HUD text. Numbers always use tabular digits so they do not jitter.
export const Label: React.FC<{
  children: React.ReactNode;
  size?: Size;
  weight?: Weight;
  color?: string;
  scale?: number;
  tracking?: number;
  style?: React.CSSProperties;
}> = ({
  children,
  size = "body",
  weight = "medium",
  color,
  scale = 1,
  tracking = 1,
  style,
}) => {
  const C = useTheme();
  return (
    <div
      style={{
        fontFamily: TYPOGRAPHY.family,
        fontWeight: TYPOGRAPHY.weights[weight],
        fontVariantNumeric: TYPOGRAPHY.numeric,
        fontSize: Math.round(TYPOGRAPHY.sizes[size] * scale),
        letterSpacing: TYPOGRAPHY.letterSpacing * 2 * tracking * scale,
        lineHeight: 1,
        textTransform: "uppercase",
        whiteSpace: "nowrap",
        color: color ?? C.primary,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

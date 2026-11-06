import React from "react";
import { AbsoluteFill } from "remotion";
import { ALL_THEMES, ThemeContext, type ThemeName } from "../styles/theme";

export const Themed: React.FC<{
  theme: ThemeName;
  children: React.ReactNode;
}> = ({ theme, children }) => {
  const t = ALL_THEMES[theme];
  return (
    <ThemeContext.Provider value={t}>
      {t.sceneFilter ? (
        <AbsoluteFill style={{ filter: t.sceneFilter }}>
          {children}
        </AbsoluteFill>
      ) : (
        children
      )}
    </ThemeContext.Provider>
  );
};

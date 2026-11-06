// Transparent output: ProRes 4444 with alpha, PNG frames.
// Overrides the global JPEG setting in remotion.config.ts.
export const transparentProRes = (outName: string) => () => ({
  defaultCodec: "prores" as const,
  defaultProResProfile: "4444" as const,
  defaultPixelFormat: "yuva444p10le" as const,
  defaultVideoImageFormat: "png" as const,
  defaultOutName: outName,
});

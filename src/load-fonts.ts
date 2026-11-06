import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";
import { TYPOGRAPHY } from "./styles/typography";

const FILES = [
  { file: "SpaceGrotesk-Light.ttf", weight: TYPOGRAPHY.weights.light },
  { file: "SpaceGrotesk-Regular.ttf", weight: TYPOGRAPHY.weights.regular },
  { file: "SpaceGrotesk-Medium.ttf", weight: TYPOGRAPHY.weights.medium },
  { file: "SpaceGrotesk-Bold.ttf", weight: TYPOGRAPHY.weights.bold },
];

for (const { file, weight } of FILES) {
  loadFont({
    family: TYPOGRAPHY.family,
    url: staticFile(`fonts/${file}`),
    weight: String(weight),
  });
}

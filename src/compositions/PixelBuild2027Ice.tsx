import { PixelBuildScene } from "../components/PixelBuildScene";
import { Themed } from "../components/Themed";

// 2027 assembled on a dot-matrix grid, ice-blue background.
export const PixelBuild2027Ice: React.FC = () => (
  <Themed theme="ice">
    <PixelBuildScene cell={96} gap={16} />
  </Themed>
);

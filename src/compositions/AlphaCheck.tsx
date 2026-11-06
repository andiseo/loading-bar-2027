import { AbsoluteFill } from "remotion";
import {
  Countdown2027Alpha,
  LoadingBar2027Alpha,
  SystemUpdate2027Alpha,
} from "./AlphaVersions";

// Preview only, not for upload: an alpha version over a light or dark backdrop.
const SCENES = {
  loading: LoadingBar2027Alpha,
  countdown: Countdown2027Alpha,
  update: SystemUpdate2027Alpha,
};
const BACKDROPS = {
  light: "linear-gradient(135deg, #D9DEE3 0%, #F4F1EA 50%, #C9D3DB 100%)",
  dark: "linear-gradient(135deg, #1B2430 0%, #3A2F28 50%, #10161D 100%)",
};

export type AlphaCheckProps = {
  scene: keyof typeof SCENES;
  backdrop: keyof typeof BACKDROPS;
};

export const AlphaCheck: React.FC<AlphaCheckProps> = ({ scene, backdrop }) => {
  const Scene = SCENES[scene];
  return (
    <AbsoluteFill style={{ background: BACKDROPS[backdrop] }}>
      <Scene />
    </AbsoluteFill>
  );
};

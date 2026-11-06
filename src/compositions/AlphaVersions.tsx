import { CountdownScene } from "../components/CountdownScene";
import { LoadingBarScene } from "../components/LoadingBarScene";
import { SystemUpdateScene } from "../components/SystemUpdateScene";
import { Themed } from "../components/Themed";

// Alpha-only designs for overlay use. Per CLAUDE.md, these designs must not
// also exist as solid-background versions.
export const LoadingBar2027Alpha: React.FC = () => (
  <Themed theme="alpha">
    <LoadingBarScene barWidth={2400} yearSize={560} />
  </Themed>
);

export const Countdown2027Alpha: React.FC = () => (
  <Themed theme="alpha">
    <CountdownScene ringRadius={600} numberSize={560} yearSize={520} />
  </Themed>
);

export const SystemUpdate2027Alpha: React.FC = () => (
  <Themed theme="alpha">
    <SystemUpdateScene panelWidth={2400} panelHeight={1400} yearSize={440} />
  </Themed>
);

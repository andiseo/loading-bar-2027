import { SignalBarsScene } from "../components/SignalBarsScene";

// Ten stepped signal bars, one per second, then 2027.
export const SignalBars2027: React.FC = () => (
  <SignalBarsScene
    barWidth={120}
    gap={44}
    minHeight={90}
    maxHeight={760}
    yearSize={520}
  />
);

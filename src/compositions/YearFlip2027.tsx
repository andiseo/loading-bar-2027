import { YearFlipScene } from "../components/YearFlipScene";

// 2026 turns into 2027 at 10s, with a JAN to DEC year timeline.
export const YearFlip2027: React.FC = () => (
  <YearFlipScene yearSize={600} timelineWidth={2600} />
);

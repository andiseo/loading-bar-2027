import { HourglassScene } from "../components/HourglassScene";

// Geometric hourglass runs out in 10s, turns, and clears for 2027.
export const Hourglass2027: React.FC = () => (
  <HourglassScene glassW={760} glassH={1320} yearSize={560} />
);

import { TransferScene } from "../components/TransferScene";

// Packets stream from a 2026 node to a 2027 node, which becomes the number.
export const Transfer2027: React.FC = () => (
  <TransferScene span={2400} node={360} yearSize={560} />
);

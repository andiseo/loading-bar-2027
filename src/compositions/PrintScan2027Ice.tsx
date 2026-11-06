import { PrintScanScene } from "../components/PrintScanScene";
import { Themed } from "../components/Themed";

// 2027 printed line by line, ice-blue background.
export const PrintScan2027Ice: React.FC = () => (
  <Themed theme="ice">
    <PrintScanScene yearSize={640} />
  </Themed>
);

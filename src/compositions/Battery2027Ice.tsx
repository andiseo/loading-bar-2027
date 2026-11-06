import { BatteryScene } from "../components/BatteryScene";
import { Themed } from "../components/Themed";

// Battery charges to full, 2027 cut out of the fill, ice-blue background.
export const Battery2027Ice: React.FC = () => (
  <Themed theme="ice">
    <BatteryScene width={2000} height={860} yearSize={500} />
  </Themed>
);

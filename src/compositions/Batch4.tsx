import { CoinSpinScene } from "../components/gold/CoinSpinScene";
import { ConstellationScene } from "../components/gold/ConstellationScene";
import { EventTicketScene } from "../components/gold/EventTicketScene";
import { GeoBurstScene } from "../components/gold/GeoBurstScene";
import { GoldFillScene } from "../components/gold/GoldFillScene";
import { LaserEngraveScene } from "../components/gold/LaserEngraveScene";
import { HorizonRiseScene } from "../components/gold/HorizonRiseScene";
import { SpotlightScene } from "../components/gold/SpotlightScene";
import { Themed } from "../components/Themed";

// Batch 4: gold palette, no corner labels, same timing as batch 3.

export const Constellation2027: React.FC = () => (
  <Themed theme="gold">
    <ConstellationScene scale={4.6} gap={120} />
  </Themed>
);

export const Spotlight2027: React.FC = () => (
  <Themed theme="gold">
    <SpotlightScene yearSize={480} />
  </Themed>
);

export const HorizonRise2027: React.FC = () => (
  <Themed theme="gold">
    <HorizonRiseScene yearSize={520} lineWidth={2600} />
  </Themed>
);

export const GoldFill2027: React.FC = () => (
  <Themed theme="gold">
    <GoldFillScene fontSize={640} />
  </Themed>
);

export const GeoBurst2027Alpha: React.FC = () => (
  <Themed theme="goldAlpha">
    <GeoBurstScene yearSize={420} />
  </Themed>
);

export const EventTicket2027Alpha: React.FC = () => (
  <Themed theme="goldAlpha">
    <EventTicketScene yearSize={340} />
  </Themed>
);

export const LaserEngrave2027Alpha: React.FC = () => (
  <Themed theme="goldAlpha">
    <LaserEngraveScene fontSize={620} />
  </Themed>
);

export const CoinSpin2027Alpha: React.FC = () => (
  <Themed theme="goldAlpha">
    <CoinSpinScene radius={640} yearSize={300} />
  </Themed>
);

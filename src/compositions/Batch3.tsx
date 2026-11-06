import { DotRingScene } from "../components/hud/DotRingScene";
import { GaugeDialScene } from "../components/hud/GaugeDialScene";
import { IrisScene } from "../components/hud/IrisScene";
import { OrbitRingsScene } from "../components/hud/OrbitRingsScene";
import { ReticleLockScene } from "../components/hud/ReticleLockScene";
import { SonarPingScene } from "../components/hud/SonarPingScene";
import { TextRingScene } from "../components/hud/TextRingScene";
import { WireGlobeScene } from "../components/hud/WireGlobeScene";
import { YearRouteScene } from "../components/hud/YearRouteScene";
import { Themed } from "../components/Themed";

// Batch 3: short HUD clips, 2027 fully in place at 5s.
// Palette A (navy + cyan): ReticleLock, GaugeDial, SonarPing, DotRing, TextRing.
// Palette B (electric blue): OrbitRings, Iris, WireGlobe, YearRoute.

export const ReticleLock2027: React.FC = () => (
  <Themed theme="hudA">
    <ReticleLockScene radius={580} yearSize={380} />
  </Themed>
);

export const GaugeDial2027: React.FC = () => (
  <Themed theme="hudA">
    <GaugeDialScene radius={780} readoutSize={300} />
  </Themed>
);

export const SonarPing2027: React.FC = () => (
  <Themed theme="hudA">
    <SonarPingScene yearSize={420} countSize={240} />
  </Themed>
);

export const DotRing2027Alpha: React.FC = () => (
  <Themed theme="hudAAlpha">
    <DotRingScene radius={600} yearSize={360} />
  </Themed>
);

export const TextRing2027Alpha: React.FC = () => (
  <Themed theme="hudAAlpha">
    <TextRingScene radius={640} yearSize={340} />
  </Themed>
);

export const OrbitRings2027Alpha: React.FC = () => (
  <Themed theme="hudBAlpha">
    <OrbitRingsScene yearSize={380} />
  </Themed>
);

export const Iris2027: React.FC = () => (
  <Themed theme="hudB">
    <IrisScene radius={700} yearSize={420} />
  </Themed>
);

export const WireGlobe2027: React.FC = () => (
  <Themed theme="hudB">
    <WireGlobeScene radius={560} yearSize={460} />
  </Themed>
);

export const YearRoute2027Alpha: React.FC = () => (
  <Themed theme="hudBAlpha">
    <YearRouteScene yearSize={420} />
  </Themed>
);

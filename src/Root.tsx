import { Composition, Folder } from "remotion";
import { AlphaCheck, type AlphaCheckProps } from "./compositions/AlphaCheck";
import {
  Countdown2027Alpha,
  LoadingBar2027Alpha,
  SystemUpdate2027Alpha,
} from "./compositions/AlphaVersions";
import { Battery2027Ice } from "./compositions/Battery2027Ice";
import { Counter2027 } from "./compositions/Counter2027";
import { Hourglass2027 } from "./compositions/Hourglass2027";
import { PixelBuild2027Ice } from "./compositions/PixelBuild2027Ice";
import { PrintScan2027Ice } from "./compositions/PrintScan2027Ice";
import { transparentProRes } from "./compositions/render-config";
import { SignalBars2027 } from "./compositions/SignalBars2027";
import { Transfer2027 } from "./compositions/Transfer2027";
import { YearFlip2027 } from "./compositions/YearFlip2027";
import {
  DotRing2027Alpha,
  GaugeDial2027,
  Iris2027,
  OrbitRings2027Alpha,
  ReticleLock2027,
  SonarPing2027,
  TextRing2027Alpha,
  WireGlobe2027,
  YearRoute2027Alpha,
} from "./compositions/Batch3";
import {
  CoinSpin2027Alpha,
  Constellation2027,
  EventTicket2027Alpha,
  GeoBurst2027Alpha,
  GoldFill2027,
  HorizonRise2027,
  LaserEngrave2027Alpha,
  Spotlight2027,
} from "./compositions/Batch4";
import { BATCH3, CANVAS } from "./styles/layout";

const short = {
  width: CANVAS.width,
  height: CANVAS.height,
  fps: CANVAS.fps,
  durationInFrames: BATCH3.short,
};
const long = { ...short, durationInFrames: BATCH3.long };

const horizontal = {
  width: CANVAS.width,
  height: CANVAS.height,
  fps: CANVAS.fps,
  durationInFrames: CANVAS.durationInFrames,
};

export const RemotionRoot: React.FC = () => {
  return (
    <Folder name="Loading-Bar-2027">
      <Folder name="Batch-1">
        <Composition
          id="YearFlip2027"
          component={YearFlip2027}
          {...horizontal}
        />
        <Composition id="Counter2027" component={Counter2027} {...horizontal} />
        <Composition
          id="SignalBars2027"
          component={SignalBars2027}
          {...horizontal}
        />
        <Composition
          id="Transfer2027"
          component={Transfer2027}
          {...horizontal}
        />
        <Composition
          id="Hourglass2027"
          component={Hourglass2027}
          {...horizontal}
        />
      </Folder>

      <Folder name="Batch-2">
        <Composition
          id="PixelBuild2027Ice"
          component={PixelBuild2027Ice}
          {...horizontal}
        />
        <Composition
          id="PrintScan2027Ice"
          component={PrintScan2027Ice}
          {...horizontal}
        />
        <Composition
          id="Battery2027Ice"
          component={Battery2027Ice}
          {...horizontal}
        />
        <Composition
          id="LoadingBar2027Alpha"
          component={LoadingBar2027Alpha}
          {...horizontal}
          calculateMetadata={transparentProRes("lb2027-loading-alpha.mov")}
        />
        <Composition
          id="Countdown2027Alpha"
          component={Countdown2027Alpha}
          {...horizontal}
          calculateMetadata={transparentProRes("lb2027-countdown-alpha.mov")}
        />
        <Composition
          id="SystemUpdate2027Alpha"
          component={SystemUpdate2027Alpha}
          {...horizontal}
          calculateMetadata={transparentProRes("lb2027-update-alpha.mov")}
        />
      </Folder>

      <Folder name="Batch-3">
        <Composition
          id="ReticleLock2027"
          component={ReticleLock2027}
          {...long}
        />
        <Composition id="GaugeDial2027" component={GaugeDial2027} {...long} />
        <Composition id="SonarPing2027" component={SonarPing2027} {...short} />
        <Composition
          id="DotRing2027Alpha"
          component={DotRing2027Alpha}
          {...long}
          calculateMetadata={transparentProRes("lb2027-dotring-alpha.mov")}
        />
        <Composition
          id="TextRing2027Alpha"
          component={TextRing2027Alpha}
          {...short}
          calculateMetadata={transparentProRes("lb2027-textring-alpha.mov")}
        />
        <Composition
          id="OrbitRings2027Alpha"
          component={OrbitRings2027Alpha}
          {...short}
          calculateMetadata={transparentProRes("lb2027-orbit-alpha.mov")}
        />
        <Composition id="Iris2027" component={Iris2027} {...short} />
        <Composition id="WireGlobe2027" component={WireGlobe2027} {...long} />
        <Composition
          id="YearRoute2027Alpha"
          component={YearRoute2027Alpha}
          {...long}
          calculateMetadata={transparentProRes("lb2027-route-alpha.mov")}
        />
      </Folder>

      <Folder name="Batch-4">
        <Composition
          id="Constellation2027"
          component={Constellation2027}
          {...long}
        />
        <Composition id="Spotlight2027" component={Spotlight2027} {...long} />
        <Composition
          id="HorizonRise2027"
          component={HorizonRise2027}
          {...short}
        />
        <Composition id="GoldFill2027" component={GoldFill2027} {...short} />
        <Composition
          id="GeoBurst2027Alpha"
          component={GeoBurst2027Alpha}
          {...long}
          calculateMetadata={transparentProRes("lb2027-burst-alpha.mov")}
        />
        <Composition
          id="EventTicket2027Alpha"
          component={EventTicket2027Alpha}
          {...long}
          calculateMetadata={transparentProRes("lb2027-ticket-alpha.mov")}
        />
        <Composition
          id="LaserEngrave2027Alpha"
          component={LaserEngrave2027Alpha}
          {...short}
          calculateMetadata={transparentProRes("lb2027-laser-alpha.mov")}
        />
        <Composition
          id="CoinSpin2027Alpha"
          component={CoinSpin2027Alpha}
          {...short}
          calculateMetadata={transparentProRes("lb2027-coin-alpha.mov")}
        />
      </Folder>

      {/* Preview only: alpha versions over light and dark backdrops. */}
      <Folder name="Checks">
        {(["loading", "countdown", "update"] as const).map((scene) =>
          (["light", "dark"] as const).map((backdrop) => (
            <Composition
              key={`${scene}-${backdrop}`}
              id={`AlphaCheck-${scene}-${backdrop}`}
              component={AlphaCheck}
              defaultProps={{ scene, backdrop } satisfies AlphaCheckProps}
              {...horizontal}
            />
          )),
        )}
      </Folder>
    </Folder>
  );
};

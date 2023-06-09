import { useState } from "react";
import ChannelLabel from "./ChannelLabel";
import VuMeter from "./VuMeter";
import useVuMeter from "../hooks/useVuMeter";
import { dbToPercent, localStorageGet, localStorageSet } from "../utils/";

type Props = {
  busChannels: BusChannel[];
  busIndex: number;
};

function BusChannel({ busChannels, busIndex }: Props) {
  const currentMixString = localStorage.getItem("currentMix");
  const currentMix = currentMixString && JSON.parse(currentMixString);

  const [busVolumes, setBusVolumes] = useState(
    () => currentMix.busVolumes ?? [0.5, 0.5]
  );
  const meterVal = useVuMeter([busChannels[busIndex]]);

  return (
    <div>
      <div className="channel">
        <div className="flex-y fader-wrap">
          <div className="window">{`${dbToPercent(busVolumes[busIndex]).toFixed(
            0
          )} dB`}</div>
          <div className="levels-wrap">
            <VuMeter meterValue={meterVal} height={150} width={12} />
          </div>
          <div className="vol-wrap">
            <input
              type="range"
              id={`busVol${busIndex}`}
              className="range-y volume"
              min={0}
              max={1}
              step={0.001}
              value={busVolumes[busIndex]}
              onChange={(e: React.FormEvent<HTMLInputElement>): void => {
                const currentMix = localStorageGet("currentMix");
                const value = parseFloat(e.currentTarget.value);
                busChannels[busIndex]!.gain.value = value;
                busVolumes[busIndex] = value;
                setBusVolumes([...busVolumes]);
                currentMix.busVolumes[busIndex] = value;
                localStorageSet("currentMix", currentMix);
              }}
            />
          </div>
          <ChannelLabel channelName={`Bus ${busIndex + 1}`} />
        </div>
      </div>
    </div>
  );
}

export default BusChannel;

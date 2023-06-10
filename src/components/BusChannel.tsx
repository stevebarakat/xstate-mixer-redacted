import { useState } from "react";
import type { Gain } from "tone";
import ChannelLabel from "./ChannelLabel";
import VuMeter from "./VuMeter";
import useVuMeter from "../hooks/useVuMeter";
import { normalRangeToDb, log, dbToPercent } from "../utils/scale";

type Props = {
  busChannels: Gain[];
  busIndex: number;
};

function BusChannel({ busChannels, busIndex }: Props) {
  const [busVolumes, setBusVolumes] = useState([-32, -32]);
  const meterVal = useVuMeter([busChannels[busIndex]]);
  return (
    <div>
      <div className="channel">
        <div className="flex-y fader-wrap">
          <div className="window">{`${busVolumes[busIndex].toFixed(
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
              value={busChannels[busIndex].gain.value}
              onChange={(e: React.FormEvent<HTMLInputElement>): void => {
                const value = parseFloat(e.currentTarget.value);
                // const scaled = dbToPercent(log(value));
                busChannels[busIndex].gain.value = value;
                busVolumes[busIndex] = dbToPercent(value);
                setBusVolumes([...busVolumes]);
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

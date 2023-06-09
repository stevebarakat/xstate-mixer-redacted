import { useState } from "react";
import type { Gain } from "tone";
import ChannelLabel from "./ChannelLabel";
import VuMeter from "./VuMeter";
import useVuMeter from "../hooks/useVuMeter";

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
              value={busVolumes[busIndex]}
              onChange={(e: React.FormEvent<HTMLInputElement>): void => {
                const value = parseFloat(e.currentTarget.value);
                // const scaled = dBToPercent(scale(value));
                busChannels[busIndex].gain.value = value;
                busVolumes[busIndex] = value;
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

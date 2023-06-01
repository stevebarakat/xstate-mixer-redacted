import { useState } from "react";
import BusFxMenu from "./BusFxMenu";
import type { Channel } from "tone";
import ChannelLabel from "../ChannelLabel";
import { dBToPercent, scale } from "../../utils/scale";
import VuMeter from "../VuMeter";
import useVuMeter from "../../hooks/useVuMeter";

type Props = {
  busChannels: Channel[];
  busIndex: number;
  disabled: boolean;
};

function BusChannel({ busChannels, busIndex, disabled }: Props) {
  const [busVolumes, setBusVolumes] = useState([-32, -32]);
  const meterVal = useVuMeter([busChannels[busIndex]]);
  return (
    <div>
      <BusFxMenu busIndex={busIndex} disabled={disabled} />
      <div className="channel">
        <div className="flex-y center fader-wrap">
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
              min={-100}
              max={12}
              step={0.1}
              value={busVolumes[busIndex]}
              onChange={(e: React.FormEvent<HTMLInputElement>): void => {
                const value = parseFloat(e.currentTarget.value);
                const scaled = dBToPercent(scale(value));
                busChannels[busIndex].volume.value = scaled;
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

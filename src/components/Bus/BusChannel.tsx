import { useState } from "react";
import BusFxMenu from "./BusFxMenu";
import type { Channel } from "tone";

type Props = {
  busChannels: React.MutableRefObject<Channel[]>;
  busIndex: number;
  disabled: boolean;
};

function BusChannel({ busChannels, busIndex, disabled }: Props) {
  const [busVolumes, setBusVolumes] = useState([-32, -32]);

  return (
    <div>
      <BusFxMenu busIndex={busIndex} disabled={disabled} />
      <div className="channel">
        <div className="flex-y center">
          <div className="window">{`${busVolumes[busIndex].toFixed(
            0
          )} dB`}</div>
          <input
            type="range"
            id={`busVol${busIndex}`}
            className="range-y"
            min={-100}
            max={12}
            step={0.1}
            value={busVolumes[busIndex]}
            onChange={(e: React.FormEvent<HTMLInputElement>): void => {
              busChannels.current[busIndex].volume.value = parseFloat(
                e.currentTarget.value
              );
              busVolumes[busIndex] = parseFloat(e.currentTarget.value);
              setBusVolumes([...busVolumes]);
            }}
          />

          <label htmlFor={`busVol${busIndex}`}>{`Bus ${busIndex + 1}`}</label>
        </div>
      </div>
    </div>
  );
}

export default BusChannel;

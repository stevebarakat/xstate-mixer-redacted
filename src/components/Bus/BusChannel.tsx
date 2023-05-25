import { useState } from "react";
import { MixerMachineContext } from "../../App";
import BusFxMenu from "./BusFxMenu";
import type { Channel } from "tone";

type Props = {
  busChannels: React.MutableRefObject<Channel[]>;
  busIndex: number;
  disabled: boolean;
};

function BusChannel({ busChannels, busIndex, disabled }: Props) {
  const [state, send] = MixerMachineContext.useActor();
  const [isMuted, setIsMuted] = useState(false);

  return (
    <div>
      <BusFxMenu busIndex={busIndex} disabled={disabled} />
      <div className="channel">
        <div className="flex-y center">
          <div className="window">{`${state.context.busVolumes[
            busIndex
          ].toFixed(0)} dB`}</div>
          <input
            type="range"
            id={`busVol${busIndex}`}
            className="range-y"
            min={-100}
            max={12}
            step={0.1}
            value={state.context.busVolumes[busIndex]}
            onChange={(e: React.FormEvent<HTMLInputElement>): void => {
              send({
                type: "CHANGE_BUS_VOLUME",
                value: parseFloat(e.currentTarget.value),
                channel: busChannels.current[busIndex],
                busIndex,
              });
            }}
          />
          <>
            <input
              id={`trackMute${busIndex}`}
              type="checkbox"
              className="check"
              onChange={(): void => {
                setIsMuted(!isMuted);
                busChannels.current[busIndex].mute = isMuted;
              }}
              checked={isMuted}
            />
            <label htmlFor={`trackMute${busIndex}`}>M</label>
          </>
          <label htmlFor={`busVol${busIndex}`}>{`Bus ${busIndex + 1}`}</label>
        </div>
      </div>
    </div>
  );
}

export default BusChannel;

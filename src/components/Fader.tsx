import type { Destination } from "tone/build/esm/core/context/Destination";
import type { Gain, Channel } from "tone";
import { MixerMachineContext } from "../App";

type Props = {
  trackIndex: number;
  channel: Gain | Channel | Destination;
};

function Fader({ trackIndex, channel }: Props) {
  const [state, send] = MixerMachineContext.useActor();
  const volume = parseFloat(state.context.volume[trackIndex]);

  return (
    <>
      <div className="window">{`${volume.toFixed(0)} dB`}</div>
      <input
        type="range"
        id={`trackVol${trackIndex}`}
        className="range-y"
        min={-100}
        max={12}
        step={0.1}
        value={volume}
        onChange={(e: React.FormEvent<HTMLInputElement>): void => {
          send({
            type: "CHANGE_TRACK_VOLUME",
            value: parseFloat(e.target.value),
            trackIndex,
            channel,
          });
        }}
      />
    </>
  );
}

export default Fader;

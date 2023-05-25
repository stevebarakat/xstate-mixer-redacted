import { MixerMachineContext } from "../App";
import type { Channel } from "tone";

type Props = {
  trackIndex: number;
  channel: Channel;
};

function Pan({ trackIndex, channel }: Props) {
  const [state, send] = MixerMachineContext.useActor();
  const pan = parseFloat(state.context.pan[trackIndex]);

  return (
    <>
      <input
        type="range"
        id={`trackPan${trackIndex}`}
        className="range-x"
        min={-1}
        max={1}
        step={0.01}
        value={pan}
        onChange={(e: React.FormEvent<HTMLInputElement>): void => {
          send({
            type: "CHANGE_PAN",
            value: parseFloat(e.target.value),
            trackIndex,
            channel,
          });
        }}
      />
    </>
  );
}

export default Pan;

import { MixerMachineContext } from "../../App";
import type { Channel } from "tone";

type Props = {
  trackIndex: number;
  channel: Channel;
};

function Mute({ trackIndex, channel }: Props) {
  const [state, send] = MixerMachineContext.useActor();
  const mute = state.context.mute[trackIndex];

  return (
    <>
      <input
        id={`trackMute${trackIndex}`}
        type="checkbox"
        className="check"
        onChange={(e: React.FormEvent<HTMLInputElement>): void => {
          send({
            type: "TOGGLE_MUTE",
            checked: e.currentTarget.checked,
            trackIndex,
            channel,
          });
        }}
        checked={mute}
      />
      <label htmlFor={`trackMute${trackIndex}`}>M</label>
    </>
  );
}

export default Mute;

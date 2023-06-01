import Solo from "./Solo";
import Mute from "./Mute";
import { Channel } from "tone";

type Props = {
  trackIndex: number;
  channel: Channel;
};

function index({ trackIndex, channel }: Props) {
  return (
    <div className="chan-strip-btn solo-mute">
      <Solo trackIndex={trackIndex} channel={channel} />
      <Mute trackIndex={trackIndex} channel={channel} />
    </div>
  );
}

export default index;

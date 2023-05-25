import { Destination } from "tone";
import type { Channel } from "tone";

type Props = {
  trackIndex: number;
  channels: Channel[];
};

function Sends({ trackIndex, channels }: Props) {
  return (
    <div className="bus-btn">
      <input
        id={`bus1${trackIndex}`}
        type="checkbox"
        onChange={(e: React.FormEvent<HTMLInputElement>): void => {
          if (e.currentTarget.checked) {
            channels[trackIndex].send("reverb1");
            channels[trackIndex].send("delay1");
          } else {
            channels[trackIndex].disconnect();
            channels[trackIndex].connect(Destination);
          }
        }}
      />
      <label htmlFor={`bus1${trackIndex}`}>1</label>
      <input
        id={`bus2${trackIndex}`}
        type="checkbox"
        onChange={(e: React.FormEvent<HTMLInputElement>): void => {
          if (e.currentTarget.checked) {
            channels[trackIndex].send("reverb2");
            channels[trackIndex].send("delay2");
          } else {
            channels[trackIndex].disconnect();
            channels[trackIndex].connect(Destination);
          }
        }}
      />
      <label htmlFor={`bus2${trackIndex}`}>2</label>
    </div>
  );
}

export default Sends;

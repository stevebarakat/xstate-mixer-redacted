import { useState } from "react";
import { Destination } from "tone";
import type { Channel } from "tone";

type Props = {
  trackIndex: number;
  channels: Channel[];
};

function Sends({ trackIndex, channels }: Props) {
  const currentTrackString = localStorage.getItem("currentTracks");
  const currentTracks = currentTrackString && JSON.parse(currentTrackString);

  const [sends, setSends] = useState(
    currentTracks[trackIndex]?.sends ?? [false, false, false, false]
  );
  return (
    <div className="bus-btn">
      <input
        id={`bus1${trackIndex}`}
        type="checkbox"
        onChange={(e: React.FormEvent<HTMLInputElement>): void => {
          if (e.currentTarget.checked) {
            channels[trackIndex].send("reverb1");
            channels[trackIndex].send("delay1");
            sends[0] = true;
            setSends([...sends]);
          } else {
            channels[trackIndex].disconnect();
            channels[trackIndex].connect(Destination);
            sends[0] = false;
            setSends([...sends]);
          }
          currentTracks[trackIndex].sends = [...sends];
          localStorage.setItem(
            "currentTracks",
            JSON.stringify([...currentTracks])
          );
        }}
        checked={sends[0]}
      />
      <label htmlFor={`bus1${trackIndex}`}>1</label>
      <input
        id={`bus2${trackIndex}`}
        type="checkbox"
        onChange={(e: React.FormEvent<HTMLInputElement>): void => {
          if (e.currentTarget.checked) {
            channels[trackIndex].send("reverb2");
            channels[trackIndex].send("delay2");
            sends[1] = true;
            setSends([...sends]);
          } else {
            channels[trackIndex].disconnect();
            channels[trackIndex].connect(Destination);
            sends[1] = false;
            setSends([...sends]);
          }
          currentTracks[trackIndex].sends = [...sends];
          localStorage.setItem(
            "currentTracks",
            JSON.stringify([...currentTracks])
          );
        }}
        checked={sends[1]}
      />
      <label htmlFor={`bus2${trackIndex}`}>2</label>
    </div>
  );
}

export default Sends;

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

  const [activeBusses, setActiveBusses] = useState(
    currentTracks[trackIndex].activeBusses ?? [false, false, false, false]
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
            activeBusses[0] = true;
            setActiveBusses([...activeBusses]);
          } else {
            channels[trackIndex].disconnect();
            channels[trackIndex].connect(Destination);
            activeBusses[0] = false;
            setActiveBusses([...activeBusses]);
          } 
          currentTracks[0].activeBusses = [...activeBusses];
          localStorage.setItem(
            "currentTracks",
            JSON.stringify([...currentTracks])
          );
        }}
        checked={activeBusses[0]}
      />
      <label htmlFor={`bus1${trackIndex}`}>1</label>
      <input
        id={`bus2${trackIndex}`}
        type="checkbox"
        onChange={(e: React.FormEvent<HTMLInputElement>): void => {
          if (e.currentTarget.checked) {
            channels[1].send("reverb2");
            channels[1].send("delay2");
            activeBusses[1] = true;
            setActiveBusses([...activeBusses]);
          } else {
            channels[1].disconnect();
            channels[1].connect(Destination);
            activeBusses[1] = false;
            setActiveBusses([...activeBusses]);
          }
          currentTracks[1].activeBusses = [...activeBusses];
          localStorage.setItem(
            "currentTracks",
            JSON.stringify([...currentTracks])
          );
        }}
        checked={activeBusses[1]}
      />
      <label htmlFor={`bus2${trackIndex}`}>2</label>
    </div>
  );
}

export default Sends;

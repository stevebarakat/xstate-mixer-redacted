import { Fragment, useState } from "react";
import type { Channel, Gain } from "tone";

type Props = {
  trackIndex: number;
  channels: Channel[];
  busChannels: Gain[] | null[];
};

function Sends({ trackIndex, channels, busChannels }: Props) {
  const currentTrackString = localStorage.getItem("currentTracks");
  const currentTracks = currentTrackString && JSON.parse(currentTrackString);

  const [sends, setSends] = useState(
    currentTracks[trackIndex]?.sends ?? [false, false, false, false]
  );
  return (
    <div className="bus-btn">
      {busChannels.map((_, busIndex) => (
        <Fragment key={busIndex}>
          <input
            id={`bus${busIndex + 1}fx${trackIndex + 1}`}
            type="checkbox"
            onChange={(e: React.FormEvent<HTMLInputElement>): void => {
              if (e.currentTarget.checked) {
                channels[trackIndex].disconnect();
                channels[trackIndex].connect(busChannels[busIndex]);
                sends[busIndex] = true;
                setSends([...sends]);
              } else {
                channels[trackIndex].disconnect();
                channels[trackIndex].toDestination();
                sends[busIndex] = false;
                setSends([...sends]);
              }
              const currentTrackString = localStorage.getItem("currentTracks");
              const currentTracks =
                currentTrackString && JSON.parse(currentTrackString);
              currentTracks[trackIndex].sends = [...sends];
              localStorage.setItem(
                "currentTracks",
                JSON.stringify([...currentTracks])
              );
            }}
            checked={sends[busIndex]}
          />
          <label htmlFor={`bus${busIndex + 1}fx${trackIndex + 1}`}>
            {busIndex + 1}
          </label>
        </Fragment>
      ))}
    </div>
  );
}

export default Sends;

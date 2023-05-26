import { useState } from "react";
import type { Destination } from "tone/build/esm/core/context/Destination";
import type { Channel } from "tone";
import { dBToPercent, scale } from "../utils/scale";
import { TrackSettings } from "../types/global";

type Props = {
  trackIndex: number;
  channel: Channel | Destination;
};

function Fader({ trackIndex, channel }: Props) {
  const currentTracksString = localStorage.getItem("currentTracks");
  const currentTracks = currentTracksString && JSON.parse(currentTracksString);
  const initialVolume = currentTracks.map(
    (currentTrack: TrackSettings) => currentTrack.volume
  );
  const [volume, setVolume] = useState(
    () => initialVolume ?? [-32, -32, -32, -32]
  );

  return (
    <>
      <div className="window">{`${volume[trackIndex].toFixed(0)} dB`}</div>
      <input
        type="range"
        id={`trackVol${trackIndex}`}
        className="range-y"
        min={-100}
        max={12}
        step={0.1}
        value={volume[trackIndex]}
        onChange={(e: React.FormEvent<HTMLInputElement>): void => {
          const value = parseFloat(e.currentTarget.value);
          volume[trackIndex] = value;
          setVolume([...volume]);
          const scaled = dBToPercent(scale(value));
          channel.volume.value = scaled;
          currentTracks[trackIndex].volume = value;
          localStorage.setItem(
            "currentTracks",
            JSON.stringify([...currentTracks])
          );
        }}
      />
    </>
  );
}

export default Fader;

import { useState } from "react";
import type { Destination } from "tone/build/esm/core/context/Destination";
import type { Channel } from "tone";
import { dBToPercent, scale } from "../utils/scale";
import { TrackSettings } from "../types/global";
import VuMeter from "./VuMeter";
import useVuMeter from "../hooks/useVuMeter";

type Props = {
  trackIndex: number;
  channel: Channel | Destination;
};

function Fader({ trackIndex, channel }: Props) {
  const currentTracksString = localStorage.getItem("currentTracks");
  const currentTracks = currentTracksString && JSON.parse(currentTracksString);

  const [volume, setVolume] = useState(
    () => currentTracks[trackIndex].volume ?? -32
  );
  const meterVal = useVuMeter([channel]);

  return (
    <div className="fader-wrap">
      <div className="window">{`${volume.toFixed(0)} dB`}</div>
      <div className="levels-wrap">
        <VuMeter meterValue={meterVal} height={150} width={12} />
      </div>
      <div className="vol-wrap">
        <input
          type="range"
          id={`trackVol${trackIndex}`}
          className="range-y volume"
          min={-100}
          max={12}
          step={0.1}
          value={volume}
          onChange={(e: React.FormEvent<HTMLInputElement>): void => {
            const value = parseFloat(e.currentTarget.value);
            setVolume(value);
            const scaled = dBToPercent(scale(value));
            channel.volume.value = scaled;
            currentTracks[trackIndex].volume = value;
            localStorage.setItem(
              "currentTracks",
              JSON.stringify([...currentTracks])
            );
          }}
        />
      </div>
    </div>
  );
}

export default Fader;

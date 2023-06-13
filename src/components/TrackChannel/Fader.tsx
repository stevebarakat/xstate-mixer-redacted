import { useState } from "react";
import { localStorageGet, localStorageSet } from "../../utils";
import { dbToPercent, log } from "../../utils/scale";
import VuMeter from "../VuMeter";
import useVuMeter from "../../hooks/useVuMeter";
import type { Meter } from "tone";

type Props = {
  trackIndex: number;
  channels: Channel[];
  meters: Meter[];
};

function Fader({ trackIndex, channels, meters }: Props) {
  const currentTracks = localStorageGet("currentTracks");

  const [volume, setVolume] = useState(
    () => currentTracks[trackIndex]?.volume ?? -32
  );
  const meterVal = useVuMeter({ channels, meters });

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
            const scaled = dbToPercent(log(value));
            channels[trackIndex].volume.value = scaled;
            const currentTracks = localStorageGet("currentTracks");
            currentTracks[trackIndex].volume = value;
            localStorageSet("currentTracks", currentTracks);
          }}
        />
      </div>
    </div>
  );
}

export default Fader;

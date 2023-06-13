import { useState } from "react";
import { localStorageGet, localStorageSet } from "../../../utils";
import { powerIcon } from "../../../assets/icons";
import type { PitchShift } from "tone";

type Props = {
  pitchShift: PitchShift | null;
  trackIndex: number;
  busIndex: number;
};

export default function PitchShifter({
  pitchShift,
  trackIndex,
  busIndex,
}: Props) {
  const currentTracksString = localStorage.getItem("currentTracks");
  const currentTracks = currentTracksString && JSON.parse(currentTracksString);

  const [isBypassed, setBypass] = useState(
    currentTracks[trackIndex].delaysBypass[busIndex] || [false, false]
  );
  const [mix, setMix] = useState(
    currentTracks[trackIndex].pitchShiftsMix || [0.5, 0.5]
  );
  const [pitch, setPitch] = useState(
    currentTracks[trackIndex].pitchShiftsPitch || [5, 5]
  );

  return (
    <div>
      <div className="flex gap12">
        <h3>Pitch Shift</h3>
        <div className="power-button">
          <input
            id={`bus${trackIndex}pitchShiftBypass`}
            type="checkbox"
            onChange={(e: React.FormEvent<HTMLInputElement>): void => {
              const checked = e.currentTarget.checked;
              isBypassed[busIndex] = checked;
              setBypass([...isBypassed]);
              if (checked) {
                pitchShift?.disconnect();
              } else {
                pitchShift?.toDestination();
              }
              const currentTracks = localStorageGet("currentTracks");
              currentTracks[trackIndex].pitchShiftsBypass[busIndex] = checked;
              localStorageSet("currentTracks", currentTracks);
            }}
            checked={isBypassed[busIndex]}
          />
          <label htmlFor={`bus${trackIndex}pitchShiftBypass`}>
            {powerIcon}
          </label>
        </div>
      </div>
      <div className="flex-y">
        <label htmlFor={`mix${trackIndex}`}>Mix:</label>
        <input
          type="range"
          className="simple-range"
          id={`mix${trackIndex}`}
          min={0}
          max={1}
          step={0.01}
          disabled={isBypassed[busIndex]}
          value={mix[busIndex]}
          onChange={(e: React.FormEvent<HTMLInputElement>): void => {
            if (!pitchShift) return;
            const value = parseFloat(e.currentTarget.value);
            pitchShift.wet.value = value;
            mix[busIndex] = value;
            setMix([...mix]);
            const currentTracks = localStorageGet("currentTracks");
            currentTracks[trackIndex].pitchShiftsMix[busIndex] = value;
            localStorageSet("currentTracks", currentTracks);
          }}
        />
      </div>
      <div className="flex-y">
        <label htmlFor="pitch">Pitch:</label>
        <input
          type="range"
          className="simple-range"
          id="pitch"
          min={-24}
          max={24}
          step={0.1}
          disabled={isBypassed[busIndex]}
          value={pitch[busIndex]}
          onChange={(e: React.FormEvent<HTMLInputElement>): void => {
            if (!pitchShift) return;
            const value = parseFloat(e.currentTarget.value);
            pitchShift.pitch = value;
            pitch[busIndex] = value;
            setMix([...mix]);
            const currentTracks = localStorageGet("currentTracks");
            currentTracks[trackIndex].pitchShiftsPitch[busIndex] = value;
            localStorageSet("currentTracks", currentTracks);
          }}
        />
      </div>
    </div>
  );
}

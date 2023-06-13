import { useState } from "react";
import { powerIcon } from "../../../assets/icons";
import type { PitchShift } from "tone";

type Props = {
  pitchShift: PitchShift;
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

  const [bypass, setBypass] = useState(
    currentTracks[trackIndex].pitchShiftsBypass || [false, false]
  );
  const [mix, setMix] = useState(
    currentTracks[trackIndex].pitchShiftsMix || [0.5, 0.5]
  );
  const [pitch, setPitch] = useState(
    currentTracks[trackIndex].pitchShiftsPitch || [5, 5]
  );

  const disabled = bypass;

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
              setBypass((checked: boolean) => checked);
              if (checked) {
                pitchShift.disconnect();
              } else {
                pitchShift.toDestination();
              }
              currentTracks[trackIndex].pitchShiftsBypass[busIndex] = checked;
              localStorage.setItem(
                "currentTracks",
                JSON.stringify(currentTracks)
              );
            }}
            checked={bypass}
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
          disabled={disabled}
          value={mix}
          onChange={(e: React.FormEvent<HTMLInputElement>): void => {
            const value = parseFloat(e.currentTarget.value);
            pitchShift.wet.value = value;
            setMix(value);
            currentTracks[trackIndex].pitchShiftsMix[busIndex] = value;
            localStorage.setItem(
              "currentTracks",
              JSON.stringify(currentTracks)
            );
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
          disabled={disabled}
          value={pitch}
          onChange={(e: React.FormEvent<HTMLInputElement>): void => {
            const value = parseFloat(e.currentTarget.value);
            pitchShift.pitch = value;
            setPitch(value);
            currentTracks[trackIndex].pitchShiftsPitch[busIndex] = value;
            localStorage.setItem(
              "currentTracks",
              JSON.stringify(currentTracks)
            );
          }}
        />
      </div>
    </div>
  );
}

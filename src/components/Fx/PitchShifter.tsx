import { useState } from "react";
import { Destination } from "tone";
import { powerIcon } from "../../assets/icons";
import type { PitchShift } from "tone";

type Props = {
  pitchShift: PitchShift;
  trackIndex: number;
};

export default function PitchShifter({ pitchShift, trackIndex }: Props) {
  const [bypass, setBypass] = useState([false, false, false, false]);
  const [mix, setMix] = useState([0.5, 0.5, 0.5, 0.5]);
  const [pitch, setPitch] = useState([0.5, 0.5, 0.5, 0.5]);

  const disabled = bypass[trackIndex];

  return (
    <div>
      <div className="flex gap12">
        <h3>Pitch Shift</h3>
        <div className="power-button">
          <input
            id={`bus${trackIndex}pitchShiftBypass`}
            type="checkbox"
            onChange={(e: React.FormEvent<HTMLInputElement>): void => {
              bypass[trackIndex] = e.currentTarget.checked;
              if (e.currentTarget.checked) {
                pitchShift.disconnect();
              } else {
                pitchShift.connect(Destination);
              }
              setBypass([...bypass]);
            }}
            checked={bypass[trackIndex]}
          />
          <label htmlFor={`bus${trackIndex}pitchShiftBypass`}>
            {powerIcon}
          </label>
        </div>
      </div>
      <div className="flex-y">
        <label htmlFor="mix">Mix:</label>
        <input
          type="range"
          className="simple-range"
          id="mix"
          min={0}
          max={1}
          step={0.01}
          disabled={disabled}
          value={mix[trackIndex]}
          onChange={(e: React.FormEvent<HTMLInputElement>): void => {
            pitchShift.wet.value = parseFloat(e.currentTarget.value);
            mix[trackIndex] = parseFloat(e.currentTarget.value);
            setMix([...mix]);
          }}
        />
      </div>
      <div className="flex-y">
        <label htmlFor="pitch">Delay Time:</label>
        <input
          type="range"
          className="simple-range"
          id="pitch"
          min={-24}
          max={24}
          step={0.1}
          disabled={disabled}
          value={pitch[trackIndex]}
          onChange={(e: React.FormEvent<HTMLInputElement>): void => {
            pitchShift.pitch = parseFloat(e.currentTarget.value);
            pitch[trackIndex] = parseFloat(e.currentTarget.value);
            setPitch([...pitch]);
          }}
        />
      </div>
    </div>
  );
}

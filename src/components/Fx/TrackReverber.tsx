import { useState } from "react";
import { Destination } from "tone";
import { powerIcon } from "../../assets/icons";
import type { Reverb } from "tone";

type Props = {
  reverb: Reverb;
  trackIndex: number;
};

export default function TrackReverber({ reverb, trackIndex }: Props) {
  const [bypass, setBypass] = useState([false, false, false, false]);
  const [mix, setMix] = useState([0.5, 0.5, 0.5, 0.5]);
  const [preDelay, setPreDelay] = useState([0.5, 0.5, 0.5, 0.5]);
  const [decay, setDecay] = useState([0.5, 0.5, 0.5, 0.5]);

  const disabled = bypass[trackIndex];

  return (
    <div>
      <div className="flex gap12">
        <h3>Reverb</h3>
        <div className="power-button">
          <input
            id={`bus${trackIndex}reverbBypass`}
            type="checkbox"
            onChange={(e: React.FormEvent<HTMLInputElement>): void => {
              bypass[trackIndex] = e.currentTarget.checked;
              if (e.currentTarget.checked) {
                reverb.disconnect();
              } else {
                reverb.connect(Destination);
              }
              setBypass([...bypass]);
            }}
            checked={bypass[trackIndex]}
          />
          <label htmlFor={`bus${trackIndex}delayBypass`}>{powerIcon}</label>
        </div>
      </div>
      <div className="flex-y">
        <label htmlFor="mix">Mix:</label>
        <input
          type="range"
          className="simple-range"
          name="mix"
          min={0}
          max={1}
          step={0.01}
          disabled={disabled}
          value={mix[trackIndex]}
          onChange={(e: React.FormEvent<HTMLInputElement>): void => {
            reverb.wet.value = parseFloat(e.currentTarget.value);
            mix[trackIndex] = parseFloat(e.currentTarget.value);
            setMix([...mix]);
          }}
        />
      </div>
      <div className="flex-y">
        <label htmlFor="pre-delay">Pre Delay:</label>
        <input
          type="range"
          className="simple-range"
          name="pre-delay"
          min={0}
          max={1}
          step={0.01}
          disabled={disabled}
          value={preDelay[trackIndex]}
          onChange={(e: React.FormEvent<HTMLInputElement>): void => {
            reverb.preDelay = parseFloat(e.currentTarget.value);
            preDelay[trackIndex] = parseFloat(e.currentTarget.value);
            setPreDelay([...mix]);
          }}
        />
      </div>
      <div className="flex-y">
        <label htmlFor="decay">Decay:</label>
        <input
          type="range"
          className="simple-range"
          name="decay"
          min={0}
          max={1}
          step={0.01}
          disabled={disabled}
          value={decay[trackIndex]}
          onChange={(e: React.FormEvent<HTMLInputElement>): void => {
            reverb.decay = parseFloat(e.currentTarget.value);
            decay[trackIndex] = parseFloat(e.currentTarget.value);
            setDecay([...mix]);
          }}
        />
      </div>
    </div>
  );
}

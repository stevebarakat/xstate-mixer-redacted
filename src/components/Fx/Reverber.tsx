import { useState } from "react";
import { Destination } from "tone";
import { powerIcon } from "../../assets/icons";
import type { Reverb } from "tone";

type Props = {
  reverb: Reverb;
  busIndex: number;
  fxIndex: number;
};

export default function Reverber({ reverb, busIndex, fxIndex }: Props) {
  const [bypass, setBypass] = useState([
    [false, false],
    [false, false],
  ]);
  const [mix, setMix] = useState([
    [0.5, 0.5],
    [0.5, 0.5],
  ]);
  const [preDelay, setPreDelay] = useState([
    [0.5, 0.5],
    [0.5, 0.5],
  ]);
  const [decay, setDecay] = useState([
    [0.5, 0.5],
    [0.5, 0.5],
  ]);

  const disabled = bypass[busIndex][fxIndex];

  return (
    <div>
      <div className="flex gap12">
        <h3>Reverb</h3>
        <div className="power-button">
          <input
            id={`bus${busIndex}reverbBypass`}
            type="checkbox"
            onChange={(e: React.FormEvent<HTMLInputElement>): void => {
              bypass[busIndex][fxIndex] = e.currentTarget.checked;
              if (e.currentTarget.checked) {
                reverb.disconnect();
              } else {
                reverb.connect(Destination);
              }
              setBypass([...bypass]);
            }}
            checked={bypass[busIndex][fxIndex]}
          />
          <label htmlFor={`bus${busIndex}reverbBypass`}>{powerIcon}</label>
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
          value={mix[busIndex][fxIndex]}
          disabled={disabled}
          onChange={(e: React.FormEvent<HTMLInputElement>): void => {
            reverb.wet.value = parseFloat(e.currentTarget.value);
            mix[busIndex][fxIndex] = parseFloat(e.currentTarget.value);
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
          value={preDelay[busIndex][fxIndex]}
          disabled={disabled}
          onChange={(e: React.FormEvent<HTMLInputElement>): void => {
            reverb.preDelay = parseFloat(e.currentTarget.value);
            preDelay[busIndex][fxIndex] = parseFloat(e.currentTarget.value);
            setPreDelay([...preDelay]);
          }}
        />
      </div>
      <div className="flex-y">
        <label htmlFor="decay">Decay:</label>
        <input
          type="range"
          className="simple-range"
          name="decay"
          min={0.1}
          max={20}
          step={0.1}
          value={decay[busIndex][fxIndex]}
          disabled={disabled}
          onChange={(e: React.FormEvent<HTMLInputElement>): void => {
            reverb.decay = parseFloat(e.currentTarget.value);
            decay[busIndex][fxIndex] = parseFloat(e.currentTarget.value);
            setDecay([...decay]);
          }}
        />
      </div>
    </div>
  );
}

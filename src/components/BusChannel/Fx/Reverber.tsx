import { useState } from "react";
import { Destination } from "tone";
import { powerIcon } from "../../../assets/icons";
import type { Reverb } from "tone";

type Props = {
  reverb: Reverb;
  busIndex: number;
  fxIndex: number;
};

export default function Reverber({ reverb, busIndex, fxIndex }: Props) {
  const currentMixString = localStorage.getItem("currentMix");
  const currentMix = currentMixString && JSON.parse(currentMixString);

  const [bypass, setBypass] = useState(
    currentMix.busFxData.reverbsBypass || [
      [false, false],
      [false, false],
    ]
  );
  const [mix, setMix] = useState(
    currentMix.busFxData.reverbsMix || [
      [0.5, 0.5],
      [0.5, 0.5],
    ]
  );

  const [preDelay, setPreDelay] = useState(
    currentMix.busFxData.reverbsPreDelay || [
      [0.5, 0.5],
      [0.5, 0.5],
    ]
  );
  const [decay, setDecay] = useState(
    currentMix.busFxData.reverbsDecay || [
      [0.5, 0.5],
      [0.5, 0.5],
    ]
  );

  const disabled = bypass[busIndex];

  return (
    <div>
      <div className="flex gap12">
        <h3>Reverb</h3>
        <div className="power-button">
          <input
            id={`bus${busIndex}reverbBypass`}
            type="checkbox"
            onChange={(e: React.FormEvent<HTMLInputElement>): void => {
              const checked = e.currentTarget.checked;
              bypass[busIndex] = checked;
              if (checked) {
                reverb.disconnect();
              } else {
                reverb.connect(Destination);
              }
              setBypass([...bypass]);
              currentMix.busFxData.reverbsBypass[busIndex] = checked;
              localStorage.setItem("currentMix", JSON.stringify(currentMix));
            }}
            checked={bypass[busIndex]}
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
            const value = parseFloat(e.currentTarget.value);
            reverb.wet.value = value;
            mix[busIndex][fxIndex] = value;
            setMix([...mix]);
            currentMix.busFxData.reverbsMix[busIndex][fxIndex] = value;
            localStorage.setItem("currentMix", JSON.stringify(currentMix));
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
            const value = parseFloat(e.currentTarget.value);
            reverb.preDelay = value;
            preDelay[busIndex][fxIndex] = value;
            setPreDelay([...preDelay]);
            currentMix.busFxData.reverbsPreDelay[busIndex][fxIndex] = value;
            localStorage.setItem("currentMix", JSON.stringify(currentMix));
          }}
        />
      </div>
      <div className="flex-y">
        <label htmlFor="decay">Decay:</label>
        <input
          type="range"
          className="simple-range"
          name="decay"
          min={0.5}
          max={12.5}
          step={0.1}
          value={decay[busIndex][fxIndex]}
          disabled={disabled}
          onChange={(e: React.FormEvent<HTMLInputElement>): void => {
            const value = parseFloat(e.currentTarget.value);
            reverb.decay = value;
            decay[busIndex][fxIndex] = value;
            setDecay([...decay]);
            currentMix.busFxData.reverbsDecay[busIndex][fxIndex] = value;
            localStorage.setItem("currentMix", JSON.stringify(currentMix));
          }}
        />
      </div>
    </div>
  );
}

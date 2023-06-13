import { useState } from "react";
import { localStorageGet, localStorageSet } from "../../../utils";
import { powerIcon } from "../../../assets/icons";
import type { Reverb } from "tone";

type Props = {
  reverb: Reverb | null;
  trackIndex: number;
  busIndex: number;
};

export default function Reverber({ reverb, trackIndex, busIndex }: Props) {
  const currentTracksString = localStorage.getItem("currentTracks");
  const currentTracks = currentTracksString && JSON.parse(currentTracksString);

  const [isBypassed, setBypass] = useState(
    currentTracks[trackIndex].reverbsBypass || [true, true]
  );
  const [mix, setMix] = useState(
    currentTracks[trackIndex].reverbsMix || [0.5, 0.5]
  );
  const [preDelay, setPreDelay] = useState(
    currentTracks[trackIndex].reverbsPreDelay || [0.5, 0.5]
  );
  const [decay, setDecay] = useState(
    currentTracks[trackIndex].reverbsDecay || [0.5, 0.5]
  );

  console.log("reverb", reverb);

  return (
    <div>
      <div className="flex gap12">
        <h3>Reverb</h3>
        <div className="power-button">
          <input
            id={`track${trackIndex}reverbBypass`}
            type="checkbox"
            onChange={(e: React.FormEvent<HTMLInputElement>): void => {
              const checked = e.currentTarget.checked;
              isBypassed[busIndex] = checked;
              setBypass([...isBypassed]);
              if (checked) {
                reverb?.disconnect();
              } else {
                reverb?.toDestination();
              }
              const currentTracks = localStorageGet("currentTracks");
              currentTracks[trackIndex].reverbsBypass[busIndex] = checked;
              localStorageSet("currentTracks", currentTracks);
            }}
            defaultChecked={isBypassed[busIndex]}
          />
          <label htmlFor={`track${trackIndex}reverbBypass`}>{powerIcon}</label>
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
          step={0.001}
          disabled={isBypassed[busIndex]}
          defaultValue={mix[busIndex]}
          onChange={(e: React.FormEvent<HTMLInputElement>): void => {
            if (!reverb) return;
            const value = parseFloat(e.currentTarget.value);
            reverb.wet.value = value;
            mix[busIndex] = value;
            setMix([...mix]);
            const currentTracks = localStorageGet("currentTracks");
            currentTracks[trackIndex].reverbsMix[busIndex] = value;
            localStorageSet("currentTracks", currentTracks);
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
          step={0.001}
          disabled={isBypassed[busIndex]}
          defaultValue={preDelay[busIndex]}
          onChange={(e: React.FormEvent<HTMLInputElement>): void => {
            if (!reverb) return;
            const value = parseFloat(e.currentTarget.value);
            reverb.preDelay = value;
            preDelay[busIndex] = value;
            setPreDelay([...preDelay]);
            const currentTracks = localStorageGet("currentTracks");
            currentTracks[trackIndex].reverbsPreDelay[busIndex] = value;
            localStorageSet("currentTracks", currentTracks);
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
          disabled={isBypassed[busIndex]}
          defaultValue={decay[busIndex]}
          onChange={(e: React.FormEvent<HTMLInputElement>): void => {
            if (!reverb) return;
            const value = parseFloat(e.currentTarget.value);
            reverb.decay = value;
            decay[busIndex] = value;
            setDecay([...decay]);
            const currentTracks = localStorageGet("currentTracks");
            currentTracks[trackIndex].reverbsDecay[busIndex] = value;
            localStorageSet("currentTracks", currentTracks);
          }}
        />
      </div>
    </div>
  );
}

import { useState } from "react";
import { Destination } from "tone";
import { powerIcon } from "../../../assets/icons";
import type { Reverb } from "tone";

type Props = {
  reverb: Reverb;
  trackIndex: number;
};

export default function TrackReverber({ reverb, trackIndex }: Props) {
  const currentTracksString = localStorage.getItem("currentTracks");
  const currentTracks = currentTracksString && JSON.parse(currentTracksString);

  const [isBypassed, setBypass] = useState(
    currentTracks[trackIndex].reverbsBypass || false
  );
  const [mix, setMix] = useState(currentTracks[trackIndex].reverbsMix || 0.5);
  const [preDelay, setPreDelay] = useState(
    currentTracks[trackIndex].reverbsPreDelay || 0.5
  );
  const [decay, setDecay] = useState(
    currentTracks[trackIndex].reverbsDecay || 0.5
  );

  return (
    <div>
      <div className="flex gap12">
        <h3>Reverb</h3>
        <div className="power-button">
          <input
            id={`track${trackIndex}reverbBypass`}
            type="checkbox"
            onChange={(e: React.FormEvent<HTMLInputElement>): void => {
              const currentTracksString = localStorage.getItem("currentTracks");
              const currentTracks =
                currentTracksString && JSON.parse(currentTracksString);
              const checked = e.currentTarget.checked;
              setBypass(checked);
              if (isBypassed) {
                reverb.disconnect();
              } else {
                reverb.connect(Destination);
              }
              currentTracks[trackIndex].reverbsBypass = checked;
              localStorage.setItem(
                "currentTracks",
                JSON.stringify(currentTracks)
              );
            }}
            checked={isBypassed}
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
          disabled={isBypassed}
          value={mix}
          onChange={(e: React.FormEvent<HTMLInputElement>): void => {
            const currentTracksString = localStorage.getItem("currentTracks");
            const currentTracks =
              currentTracksString && JSON.parse(currentTracksString);
            const value = parseFloat(e.currentTarget.value);
            reverb.wet.value = value;
            setMix(value);
            currentTracks[trackIndex].reverbsMix = value;
            localStorage.setItem(
              "currentTracks",
              JSON.stringify(currentTracks)
            );
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
          disabled={isBypassed}
          value={preDelay}
          onChange={(e: React.FormEvent<HTMLInputElement>): void => {
            const currentTracksString = localStorage.getItem("currentTracks");
            const currentTracks =
              currentTracksString && JSON.parse(currentTracksString);
            const value = parseFloat(e.currentTarget.value);
            reverb.preDelay = value;
            setPreDelay(value);
            currentTracks[trackIndex].reverbsPreDelay = value;
            localStorage.setItem(
              "currentTracks",
              JSON.stringify([...currentTracks])
            );
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
          disabled={isBypassed}
          value={decay}
          onChange={(e: React.FormEvent<HTMLInputElement>): void => {
            const currentTracksString = localStorage.getItem("currentTracks");
            const currentTracks =
              currentTracksString && JSON.parse(currentTracksString);
            const value = parseFloat(e.currentTarget.value);
            reverb.decay = value;
            setDecay(value);
            currentTracks[trackIndex].reverbsDecay = value;
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

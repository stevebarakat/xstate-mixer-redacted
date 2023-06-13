import { useState } from "react";
import { powerIcon } from "../../../assets/icons";
import type { FeedbackDelay } from "tone";

type Props = {
  delay: FeedbackDelay;
  trackIndex: number;
  busIndex: number;
};

export default function Delay({ delay, trackIndex, busIndex }: Props) {
  const currentTracksString = localStorage.getItem("currentTracks");
  const currentTracks = currentTracksString && JSON.parse(currentTracksString);

  const [isBypassed, setBypass] = useState(
    currentTracks[trackIndex].delaysBypass[busIndex] || [false, false]
  );
  const [mix, setMix] = useState(
    currentTracks[trackIndex].delaysMix || [0.5, 0.5]
  );
  const [delayTime, setDelayTime] = useState(
    currentTracks[trackIndex].delaysTime || [0.5, 0.5]
  );
  const [feedback, setFeedback] = useState(
    currentTracks[trackIndex].delaysFeedback || [0.5, 0.5]
  );

  return (
    <div>
      <div className="flex gap12">
        <h3>Delay</h3>
        <div className="power-button">
          <input
            id={`track${trackIndex}delayBypass`}
            type="checkbox"
            onChange={(e: React.FormEvent<HTMLInputElement>): void => {
              const currentTracksString = localStorage.getItem("currentTracks");
              const currentTracks =
                currentTracksString && JSON.parse(currentTracksString);
              const checked = e.currentTarget.checked;
              setBypass((checked: boolean) => !checked);
              if (checked) {
                delay.disconnect();
              } else {
                delay.toDestination();
              }
              currentTracks[trackIndex].delaysBypass[busIndex] = checked;
              localStorage.setItem(
                "currentTracks",
                JSON.stringify(currentTracks)
              );
            }}
            checked={isBypassed}
          />
          <label htmlFor={`track${trackIndex}delayBypass`}>{powerIcon}</label>
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
          disabled={isBypassed}
          value={mix}
          onChange={(e: React.FormEvent<HTMLInputElement>): void => {
            const currentTracksString = localStorage.getItem("currentTracks");
            const currentTracks =
              currentTracksString && JSON.parse(currentTracksString);
            const value = parseFloat(e.currentTarget.value);
            delay.wet.value = value;
            mix[busIndex] = value;
            setMix(mix);
            currentTracks[trackIndex].delaysMix[busIndex] = value;
            localStorage.setItem(
              "currentTracks",
              JSON.stringify(currentTracks)
            );
          }}
        />
      </div>
      <div className="flex-y">
        <label htmlFor="delay-time">Delay Time:</label>
        <input
          type="range"
          className="simple-range"
          id="delay-time"
          min={0}
          max={1}
          step={0.01}
          disabled={isBypassed}
          value={delayTime}
          onChange={(e: React.FormEvent<HTMLInputElement>): void => {
            const currentTracksString = localStorage.getItem("currentTracks");
            const currentTracks =
              currentTracksString && JSON.parse(currentTracksString);
            const value = parseFloat(e.currentTarget.value);
            delay.delayTime.value = value;
            setDelayTime(value);
            currentTracks[trackIndex].delaysTime[busIndex] = value;
            localStorage.setItem(
              "currentTracks",
              JSON.stringify([...currentTracks])
            );
          }}
        />
      </div>
      <div className="flex-y">
        <label htmlFor="feedback">Feedback:</label>
        <input
          type="range"
          className="simple-range"
          name="feedback"
          min={0}
          max={1}
          step={0.01}
          disabled={isBypassed}
          value={feedback}
          onChange={(e: React.FormEvent<HTMLInputElement>): void => {
            const currentTracksString = localStorage.getItem("currentTracks");
            const currentTracks =
              currentTracksString && JSON.parse(currentTracksString);
            const value = parseFloat(e.currentTarget.value);
            delay.feedback.value = value;
            setFeedback(value);
            currentTracks[trackIndex].delaysFeedback[busIndex] = value;
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

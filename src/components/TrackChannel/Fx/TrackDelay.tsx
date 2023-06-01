import { useState } from "react";
import { Destination } from "tone";
import { powerIcon } from "../../../assets/icons";
import type { FeedbackDelay } from "tone";

type Props = {
  delay: FeedbackDelay;
  trackIndex: number;
};

export default function TrackDelay({ delay, trackIndex }: Props) {
  const currentTracksString = localStorage.getItem("currentTracks");
  const currentTracks = currentTracksString && JSON.parse(currentTracksString);

  const [bypass, setBypass] = useState(
    currentTracks[trackIndex].delaysBypass || false
  );
  const [mix, setMix] = useState(currentTracks[trackIndex].delaysMix || 0.5);
  const [delayTime, setDelayTime] = useState(
    currentTracks[trackIndex].delaysTime || 0.5
  );
  const [feedback, setFeedback] = useState(
    currentTracks[trackIndex].delaysFeedback || 0.5
  );

  const disabled = bypass;

  return (
    <div>
      <div className="flex gap12">
        <h3>Delay</h3>
        <div className="power-button">
          <input
            id={`track${trackIndex}delayBypass`}
            type="checkbox"
            onChange={(e: React.FormEvent<HTMLInputElement>): void => {
              const checked = e.currentTarget.checked;
              setBypass(checked);
              if (checked) {
                delay.disconnect();
              } else {
                delay.connect(Destination);
              }
              currentTracks[trackIndex].delaysBypass = checked;
              localStorage.setItem(
                "currentTracks",
                JSON.stringify(currentTracks)
              );
            }}
            checked={bypass}
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
          disabled={disabled}
          value={mix}
          onChange={(e: React.FormEvent<HTMLInputElement>): void => {
            const value = parseFloat(e.currentTarget.value);
            delay.wet.value = value;
            setMix(value);
            currentTracks[trackIndex].delaysMix = value;
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
          disabled={disabled}
          value={delayTime}
          onChange={(e: React.FormEvent<HTMLInputElement>): void => {
            const value = parseFloat(e.currentTarget.value);
            delay.delayTime.value = value;
            setDelayTime(value);
            currentTracks[trackIndex].delaysTime = value;
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
          disabled={disabled}
          value={feedback[trackIndex]}
          onChange={(e: React.FormEvent<HTMLInputElement>): void => {
            const value = parseFloat(e.currentTarget.value);
            delay.feedback.value = value;
            setFeedback(value);
            currentTracks[trackIndex].delaysFeedback = value;
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

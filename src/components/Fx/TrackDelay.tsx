import { useState } from "react";
import { Destination } from "tone";
import { powerIcon } from "../../assets/icons";
import type { FeedbackDelay } from "tone";

type Props = {
  delay: FeedbackDelay;
  trackIndex: number;
};

export default function TrackDelay({ delay, trackIndex }: Props) {
  const [bypass, setBypass] = useState([false, false, false, false]);
  const [mix, setMix] = useState([0.5, 0.5, 0.5, 0.5]);
  const [delayTime, setDelayTime] = useState([0.5, 0.5, 0.5, 0.5]);
  const [feedback, setFeedback] = useState([0.5, 0.5, 0.5, 0.5]);

  const disabled = bypass[trackIndex];

  return (
    <div>
      <div className="flex gap12">
        <h3>Delay</h3>
        <div className="power-button">
          <input
            id={`track${trackIndex}delayBypass`}
            type="checkbox"
            onChange={(e: React.FormEvent<HTMLInputElement>): void => {
              bypass[trackIndex] = e.currentTarget.checked;
              if (e.currentTarget.checked) {
                delay.disconnect();
              } else {
                delay.connect(Destination);
              }
              setBypass([...bypass]);
            }}
            checked={bypass[trackIndex]}
          />
          <label htmlFor={`track${trackIndex}delayBypass`}>{powerIcon}</label>
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
            delay.wet.value = parseFloat(e.currentTarget.value);
            mix[trackIndex] = parseFloat(e.currentTarget.value);
            setMix([...mix]);
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
          value={delayTime[trackIndex]}
          onChange={(e: React.FormEvent<HTMLInputElement>): void => {
            delay.delayTime.value = parseFloat(e.currentTarget.value);
            delayTime[trackIndex] = parseFloat(e.currentTarget.value);
            setDelayTime([...delayTime]);
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
            delay.feedback.value = parseFloat(e.currentTarget.value);
            feedback[trackIndex] = parseFloat(e.currentTarget.value);
            setFeedback([...feedback]);
          }}
        />
      </div>
    </div>
  );
}

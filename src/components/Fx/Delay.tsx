import { useState } from "react";
import { Destination } from "tone";
import { powerIcon } from "../../assets/icons";
import type { FeedbackDelay } from "tone";

type Props = {
  delay: FeedbackDelay;
  busIndex: number;
  fxIndex: number;
};

export default function Delay({ delay, busIndex, fxIndex }: Props) {
  const [bypass, setBypass] = useState([
    [false, false],
    [false, false],
  ]);
  const [mix, setMix] = useState([
    [0.5, 0.5],
    [0.5, 0.5],
  ]);
  const [delayTime, setDelayTime] = useState([
    [0.5, 0.5],
    [0.5, 0.5],
  ]);
  const [feedback, setFeedback] = useState([
    [0.5, 0.5],
    [0.5, 0.5],
  ]);

  const disabled = bypass[busIndex][fxIndex];

  return (
    <div>
      <div className="flex gap12">
        <h3>Delay</h3>
        <div className="power-button">
          <input
            id={`bus${busIndex}delayBypass`}
            type="checkbox"
            onChange={(e: React.FormEvent<HTMLInputElement>): void => {
              bypass[busIndex][fxIndex] = e.currentTarget.checked;
              if (e.currentTarget.checked) {
                delay.disconnect();
              } else {
                delay.connect(Destination);
              }
              setBypass([...bypass]);
            }}
            checked={bypass[busIndex][fxIndex]}
          />
          <label htmlFor={`bus${busIndex}delayBypass`}>{powerIcon}</label>
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
          value={mix[busIndex][fxIndex]}
          onChange={(e: React.FormEvent<HTMLInputElement>): void => {
            delay.wet.value = parseFloat(e.currentTarget.value);
            mix[busIndex][fxIndex] = parseFloat(e.currentTarget.value);
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
          value={delayTime[busIndex][fxIndex]}
          onChange={(e: React.FormEvent<HTMLInputElement>): void => {
            delay.delayTime.value = parseFloat(e.currentTarget.value);
            delayTime[busIndex][fxIndex] = parseFloat(e.currentTarget.value);
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
          value={feedback[busIndex][fxIndex]}
          onChange={(e: React.FormEvent<HTMLInputElement>): void => {
            delay.feedback.value = parseFloat(e.currentTarget.value);
            feedback[busIndex][fxIndex] = parseFloat(e.currentTarget.value);
            setFeedback([...feedback]);
          }}
        />
      </div>
    </div>
  );
}

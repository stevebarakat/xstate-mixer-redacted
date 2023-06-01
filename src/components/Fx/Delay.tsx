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
  const currentMixString = localStorage.getItem("currentMix");
  const currentMix = currentMixString && JSON.parse(currentMixString);

  const [bypass, setBypass] = useState(
    currentMix.busFxData.delaysBypass || [
      [false, false],
      [false, false],
    ]
  );
  const [mix, setMix] = useState(
    currentMix.busFxData.delaysMix || [
      [0.5, 0.5],
      [0.5, 0.5],
    ]
  );
  const [delayTime, setDelayTime] = useState(
    currentMix.busFxData.delaysTime || [
      [0.5, 0.5],
      [0.5, 0.5],
    ]
  );
  const [feedback, setFeedback] = useState(
    currentMix.busFxData.delaysFeedback || [
      [0.5, 0.5],
      [0.5, 0.5],
    ]
  );

  const disabled = bypass[busIndex];

  return (
    <div>
      <div className="flex gap12">
        <h3>Delay</h3>
        <div className="power-button">
          <input
            id={`bus${busIndex}delayBypass`}
            type="checkbox"
            onChange={(e: React.FormEvent<HTMLInputElement>): void => {
              const checked = e.currentTarget.checked;
              bypass[busIndex] = checked;
              if (checked) {
                delay.disconnect();
              } else {
                delay.connect(Destination);
              }
              setBypass([...bypass]);
              currentMix.busFxData.delaysBypass[busIndex] = checked;
              localStorage.setItem("currentMix", JSON.stringify(currentMix));
            }}
            checked={bypass[busIndex]}
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
            const value = parseFloat(e.currentTarget.value);
            delay.wet.value = value;
            mix[busIndex][fxIndex] = value;
            setMix([...mix]);
            currentMix.busFxData.delaysMix[busIndex][fxIndex] = value;
            localStorage.setItem("currentMix", JSON.stringify(currentMix));
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
            const value = parseFloat(e.currentTarget.value);
            delay.delayTime.value = parseFloat(e.currentTarget.value);
            delayTime[busIndex][fxIndex] = parseFloat(e.currentTarget.value);
            setDelayTime([...delayTime]);
            currentMix.busFxData.delaysTime[busIndex][fxIndex] = value;
            localStorage.setItem("currentMix", JSON.stringify(currentMix));
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
            const value = parseFloat(e.currentTarget.value);
            delay.feedback.value = parseFloat(e.currentTarget.value);
            feedback[busIndex][fxIndex] = parseFloat(e.currentTarget.value);
            setFeedback([...feedback]);
            currentMix.busFxData.delaysFeedback[busIndex][fxIndex] = value;
            localStorage.setItem("currentMix", JSON.stringify(currentMix));
          }}
        />
      </div>
    </div>
  );
}

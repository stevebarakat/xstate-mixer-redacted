import { MixerMachineContext } from "../../App";
import { powerIcon } from "../../assets/icons";
import type { FeedbackDelay } from "tone";

type Props = {
  delay: FeedbackDelay;
  busIndex: number;
  fxIndex: number;
};

export default function Delay({ delay, busIndex, fxIndex }: Props) {
  const [state, send] = MixerMachineContext.useActor();

  const disabled = state.context.busFxData.delaysBypass[busIndex];

  return (
    <div>
      <div className="flex gap12">
        <h3>Delay</h3>
        <div className="power-button">
          <input
            id={`bus${busIndex}delayBypass`}
            type="checkbox"
            value={state.context.busFxData.delaysBypass[busIndex]}
            onChange={(e: React.FormEvent<HTMLInputElement>): void => {
              send({
                type: "BYPASS_BUS_DELAY",
                checked: e.currentTarget.checked,
                delay,
                busIndex,
                fxIndex,
              });
            }}
            checked={state.context.busFxData.delaysBypass[busIndex][fxIndex]}
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
          value={state.context.busFxData.delaysMix[busIndex][fxIndex]}
          onChange={(e: React.FormEvent<HTMLInputElement>): void => {
            send({
              type: "CHANGE_BUS_DELAY_MIX",
              value: parseFloat(e.currentTarget.value),
              delay,
              busIndex,
              fxIndex,
            });
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
          value={state.context.busFxData.delaysTime[busIndex][fxIndex]}
          onChange={(e: React.FormEvent<HTMLInputElement>): void => {
            send({
              type: "CHANGE_BUS_DELAY_TIME",
              value: parseFloat(e.currentTarget.value),
              delay,
              busIndex,
              fxIndex,
            });
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
          value={state.context.busFxData.delaysFeedback[busIndex][fxIndex]}
          onChange={(e: React.FormEvent<HTMLInputElement>): void => {
            send({
              type: "CHANGE_BUS_DELAY_FEEDBACK",
              value: parseFloat(e.currentTarget.value),
              delay,
              busIndex,
              fxIndex,
            });
          }}
        />
      </div>
    </div>
  );
}

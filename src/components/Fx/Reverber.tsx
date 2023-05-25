import { MixerMachineContext } from "../../App";
import { powerIcon } from "../../assets/icons";
import type { Reverb } from "tone";

type Props = {
  reverb: Reverb;
  busIndex: number;
  fxIndex: number;
};

export default function Reverber({ reverb, busIndex, fxIndex }: Props) {
  const [state, send] = MixerMachineContext.useActor();

  const disabled = state.context.busFxData.reverbsBypass[busIndex];

  return (
    <div>
      <div className="flex gap12">
        <h3>Reverb</h3>
        <div className="power-button">
          <input
            id={`bus${busIndex}reverbBypass`}
            type="checkbox"
            className="power-btn"
            value={state.context.busFxData.reverbsBypass[busIndex]}
            onChange={(e: React.FormEvent<HTMLInputElement>): void => {
              send({
                type: "BYPASS_BUS_REVERB",
                checked: e.currentTarget.checked,
                reverb,
                busIndex,
                fxIndex,
              });
            }}
            checked={state.context.busFxData.reverbsBypass[busIndex][fxIndex]}
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
          value={state.context.busFxData.reverbsMix[busIndex][fxIndex]}
          disabled={disabled}
          onChange={(e: React.FormEvent<HTMLInputElement>): void => {
            send({
              type: "CHANGE_BUS_REVERB_MIX",
              value: parseFloat(e.currentTarget.value),
              reverb,
              busIndex,
              fxIndex,
            });
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
          value={state.context.busFxData.reverbsPreDelay[busIndex][fxIndex]}
          disabled={disabled}
          onChange={(e: React.FormEvent<HTMLInputElement>): void => {
            send({
              type: "CHANGE_BUS_REVERB_PREDELAY",
              value: parseFloat(e.currentTarget.value),
              reverb,
              busIndex,
              fxIndex,
            });
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
          value={state.context.busFxData.reverbsDecay[busIndex][fxIndex]}
          disabled={disabled}
          onChange={(e: React.FormEvent<HTMLInputElement>): void => {
            send({
              type: "CHANGE_BUS_REVERB_DECAY",
              value: parseFloat(e.currentTarget.value),
              reverb,
              busIndex,
              fxIndex,
            });
          }}
        />
      </div>
    </div>
  );
}

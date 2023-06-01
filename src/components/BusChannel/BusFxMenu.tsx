import { MixerMachineContext } from "../../App";
import { array as fx } from "../../utils";
import ChannelButton from "../Buttons/ChannelButton";

type Props = {
  busIndex: number;
  disabled: boolean;
};

function BusFxMenu({ busIndex, disabled }: Props) {
  const [state, send] = MixerMachineContext.useActor();

  return (
    <>
      <ChannelButton
        className="fx-select"
        id={`bus-panel-${busIndex}`}
        disabled={disabled[`panel${busIndex + 1}` as keyof typeof disabled]}
        onClick={() => {
          send({
            type: "TOGGLE_BUS_PANEL",
            busIndex,
          });
        }}
      >
        {disabled[`panel${busIndex + 1}` as keyof typeof disabled]
          ? "No"
          : state.context.busPanelActive
          ? "Close"
          : "Open"}
        FX
      </ChannelButton>
      {fx(2).map((_, fxIndex) => (
        <select
          key={fxIndex}
          id={`bus${busIndex}fx${fxIndex}`}
          className="fx-select"
          onChange={(e: React.FormEvent<HTMLSelectElement>): void => {
            send({
              type: "SET_BUS_FX",
              value: e.currentTarget.value,
              busIndex,
              fxIndex,
            });
          }}
          value={
            state.context.currentBusFx[`bus${busIndex + 1}fx${fxIndex + 1}`]
          }
        >
          <option value={`nofx`}>{`FX ${fxIndex + 1}`}</option>
          <option value={`reverb${busIndex + 1}`}>Reverb</option>
          <option value={`delay${busIndex + 1}`}>Delay</option>
        </select>
      ))}
    </>
  );
}

export default BusFxMenu;

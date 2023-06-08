import { MixerMachineContext } from "../../App";
import { shallowEqual } from "@xstate/react";
import { array as fx } from "../../utils";
import ChannelButton from "../Buttons/ChannelButton";

type Props = {
  busIndex: number;
  disabled: {
    panel1: boolean;
    panel2: boolean;
  };
};

function BusFxMenu({ busIndex, disabled }: Props) {
  const [, send] = MixerMachineContext.useActor();
  const currentBusFx = MixerMachineContext.useSelector((state) => {
    const { currentBusFx } = state.context;
    return currentBusFx;
  }, shallowEqual);

  const busPanelActive = MixerMachineContext.useSelector((state) => {
    const { busPanelActive } = state.context;
    return busPanelActive;
  }, shallowEqual);

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
          : busPanelActive[busIndex]
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
          value={currentBusFx[`bus${busIndex + 1}fx${fxIndex + 1}`]}
        >
          <option value={`nofx${busIndex + 1}`}>{`FX ${fxIndex + 1}`}</option>
          <option value={`reverb${busIndex + 1}`}>Reverb</option>
          <option value={`delay${busIndex + 1}`}>Delay</option>
        </select>
      ))}
    </>
  );
}

export default BusFxMenu;

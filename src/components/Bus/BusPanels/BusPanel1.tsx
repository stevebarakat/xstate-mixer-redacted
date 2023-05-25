import { array } from "../../../utils";
import { Rnd as BusFxPanel } from "react-rnd";
import CloseButton from "../../Buttons/CloseButton";
import Reverber from "../../Fx/Reverber";
import Delay from "../../Fx/Delay";
import { MixerMachineContext } from "../../../App";
import type { FeedbackDelay, Reverb } from "tone";

type Props = {
  disabled: { panel1: boolean; panel2: boolean };
  currentBusFx: {
    reverb1: Reverb;
    reverb2: Reverb;
    delay1: FeedbackDelay;
    delay2: FeedbackDelay;
  };
  fx: React.MutableRefObject<{
    reverb1: Reverb;
    reverb2: Reverb;
    delay1: FeedbackDelay;
    delay2: FeedbackDelay;
  }>;
};

function BusPanel1({ currentBusFx, fx, disabled }: Props) {
  const { send } = MixerMachineContext.useActorRef();

  const bpOpen0 = MixerMachineContext.useSelector(
    (state) => state.context.busPanelActive
  );

  const bpPos0 = MixerMachineContext.useSelector(
    (state) => state.context.busPanelPosition[0]
  );

  const bpSize0 = MixerMachineContext.useSelector(
    (state) => state.context.busPanelSize[0]
  );

  return (
    <div>
      {bpOpen0 && !disabled.panel1 && (
        <BusFxPanel
          className="fx-panel"
          position={bpPos0}
          onDragStop={(_, d) => {
            send({
              type: "SAVE_BUS_PANELS_POSITION",
              busIndex: 0,
              position: { x: d.x, y: d.y },
            });
          }}
          size={bpSize0}
          minWidth="200px"
          onResizeStop={(_, __, ref) => {
            send({
              type: "SAVE_BUS_PANELS_SIZE",
              busIndex: 0,
              size: { width: ref.style.width, height: ref.style.height },
            });
          }}
          cancel="input"
        >
          <CloseButton
            id="bus-panel-1"
            onClick={() => {
              send({
                type: "TOGGLE_BUS_PANEL",
                busIndex: 0,
              });
            }}
          >
            X
          </CloseButton>

          {array(2).map((_, i) => {
            switch (currentBusFx[`bus1fx${i + 1}`]) {
              case "reverb1":
                return (
                  <Reverber
                    key={`bus1reverb${i}`}
                    reverb={fx.current.reverb1}
                    busIndex={0}
                    fxIndex={0}
                  />
                );
              case "delay1":
                return (
                  <Delay
                    key={`bus1delay${i}`}
                    delay={fx.current.delay1}
                    busIndex={0}
                    fxIndex={0}
                  />
                );
              default:
                break;
            }
            return null;
          })}
        </BusFxPanel>
      )}
    </div>
  );
}

export default BusPanel1;

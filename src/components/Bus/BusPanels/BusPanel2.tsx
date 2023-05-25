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

function BusPanel2({ currentBusFx, fx, disabled }: Props) {
  const { send } = MixerMachineContext.useActorRef();

  const bpOpen1 = MixerMachineContext.useSelector(
    (state) => state.context.busPanelActive[1]
  );

  const bpPos1 = MixerMachineContext.useSelector(
    (state) => state.context.busPanelPosition[1]
  );

  const bpSize1 = MixerMachineContext.useSelector(
    (state) => state.context.busPanelSize[1]
  );

  return (
    <div>
      {bpOpen1 && !disabled.panel2 && (
        <BusFxPanel
          className="fx-panel"
          position={bpPos1}
          onDragStop={(_, d) => {
            send({
              type: "SAVE_BUS_PANELS_POSITION",
              busIndex: 1,
              position: { x: d.x, y: d.y },
            });
          }}
          size={bpSize1}
          minWidth="200px"
          onResizeStop={(_, __, ref) => {
            send({
              type: "SAVE_BUS_PANELS_SIZE",
              busIndex: 1,
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
                busIndex: 1,
              });
            }}
          >
            X
          </CloseButton>

          {array(2).map((_, i) => {
            switch (currentBusFx[`bus2fx${i + 1}`]) {
              case "reverb2":
                return (
                  <Reverber
                    key={`bus2reverb${i}`}
                    reverb={fx.reverb2}
                    busIndex={0}
                    fxIndex={0}
                  />
                );
              case "delay2":
                return (
                  <Delay
                    key={`bus2delay${i}`}
                    delay={fx.delay2}
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

export default BusPanel2;

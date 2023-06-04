import { useState } from "react";
import { MixerMachineContext } from "../../../App";
import { shallowEqual } from "@xstate/react";
import { array } from "../../../utils";
import { Rnd as BusFxPanel } from "react-rnd";
import CloseButton from "../../Buttons/CloseButton";
import Reverber from "../Fx/Reverber";
import Delay from "../Fx/Delay";
import type { FeedbackDelay, Reverb } from "tone";

type Props = {
  disabled: { panel1: boolean; panel2: boolean };
  currentBusFx: {
    reverb1: string;
    reverb2: string;
    delay1: string;
    delay2: string;
  };
  fx: React.MutableRefObject<{
    reverb1: Reverb;
    reverb2: Reverb;
    delay1: FeedbackDelay;
    delay2: FeedbackDelay;
  }>;
};

function BusPanel1({ currentBusFx, fx, disabled }: Props) {
  const [, send] = MixerMachineContext.useActor();
  const busPanelActive = MixerMachineContext.useSelector((state) => {
    const { busPanelActive } = state.context;
    return busPanelActive;
  }, shallowEqual);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: "325px", height: "auto" });

  return (
    <div>
      {busPanelActive[0] && !disabled.panel1 && (
        <BusFxPanel
          className="fx-panel"
          position={position}
          onDragStop={(_, d) => {
            setPosition({ x: d.x, y: d.y });
          }}
          size={size}
          minWidth="200px"
          onResizeStop={(_, __, ref) => {
            setSize({ width: ref.style.width, height: ref.style.height });
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
            switch (
              currentBusFx[`bus1fx${i + 1}` as keyof typeof currentBusFx]
            ) {
              case "reverb1":
                console.log("bp: reverb1");
                return (
                  <Reverber
                    key={`bus1reverb${i}`}
                    reverb={fx.current.reverb1}
                    busIndex={0}
                    fxIndex={i}
                  />
                );
              case "delay1":
                console.log("bp: delay1");
                return (
                  <Delay
                    key={`bus1delay${i}`}
                    delay={fx.current.delay1}
                    busIndex={0}
                    fxIndex={i}
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

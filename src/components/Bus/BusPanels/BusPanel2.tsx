import { useState } from "react";
import { array } from "../../../utils";
import { Rnd as BusFxPanel } from "react-rnd";
import CloseButton from "../../Buttons/CloseButton";
import Reverber from "../../Fx/Reverber";
import Delay from "../../Fx/Delay";
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

function BusPanel2({ currentBusFx, fx, disabled }: Props) {
  const [active, setActive] = useState(true);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [size, setSize] = useState({ width: "325px", height: "auto" });

  return (
    <div>
      {active && !disabled.panel2 && (
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
            id="bus-panel-2"
            onClick={() => {
              setActive(!active);
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
                    reverb={fx.current.reverb2}
                    busIndex={0}
                    fxIndex={0}
                  />
                );
              case "delay2":
                return (
                  <Delay
                    key={`bus2delay${i}`}
                    delay={fx.current.delay2}
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

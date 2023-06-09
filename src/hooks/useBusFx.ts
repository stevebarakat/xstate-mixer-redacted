import { useEffect, useRef } from "react";
import { Gain, Destination } from "tone";
import { array } from "../utils";
import { shallowEqual } from "@xstate/react";
import { MixerMachineContext } from "../App";
import type { Reverb, FeedbackDelay } from "tone";

type Props = {
  busFx: {
    reverb1: Reverb;
    delay1: FeedbackDelay;
    reverb2: Reverb;
    delay2: FeedbackDelay;
  };
};

function useBusFx({ busFx }: Props) {
  const busChannels = useRef<Gain[]>([
    new Gain().connect(Destination),
    new Gain().connect(Destination),
  ]);
  const currentBusFx = MixerMachineContext.useSelector((state) => {
    const { currentBusFx } = state.context;
    return currentBusFx;
  }, shallowEqual);

  const disabled = {
    panel1:
      currentBusFx.bus1fx1 === "nofx1" && currentBusFx.bus1fx2 === "nofx1",
    panel2:
      currentBusFx.bus2fx1 === "nofx2" && currentBusFx.bus2fx2 === "nofx2",
  };

  useEffect(() => {
    array(2).forEach((_, i) => {
      array(2).forEach((_, j) => {
        console.log(`bus${i + 1}fx${j + 1}`);
        console.log(
          "currentBusFx[`bus${i + 1}fx${j + 1}`]",
          currentBusFx[`bus${i + 1}fx${j + 1}`]
        );
        switch (currentBusFx[`bus${i + 1}fx${i + 1}`]) {
          case "nofx1":
            busChannels.current[0] && busChannels.current[0].disconnect();
            busChannels.current[0] = new Gain().connect(Destination);
            break;
          case "nofx2":
            busChannels.current[1] && busChannels.current[1].disconnect();
            busChannels.current[1] = new Gain().connect(Destination);
            break;
          case "reverb1":
            busChannels.current[0] && busChannels.current[0].disconnect();
            busChannels.current[0] = new Gain().connect(busFx.reverb1);
            break;
          case "reverb2":
            busChannels.current[1] && busChannels.current[1].disconnect();
            busChannels.current[1] = new Gain().connect(busFx.reverb2);
            break;
          case "delay1":
            busChannels.current[0] && busChannels.current[0].disconnect();
            busChannels.current[0] = new Gain().connect(busFx.delay1);
            break;
          case "delay2":
            busChannels.current[1] && busChannels.current[1].disconnect();
            busChannels.current[1] = new Gain().connect(busFx.delay2);
            break;
          default:
            break;
        }
      });
    });

    // return () => {
    //   busChannels.current.forEach((busChannel) => busChannel?.dispose());
    //   busChannels.current = [null, null];
    // };
  }, [currentBusFx, busFx]);

  return [busChannels, currentBusFx, disabled];
}

export default useBusFx;

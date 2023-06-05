import { useEffect, useRef } from "react";
import { Channel, Destination } from "tone";
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
  const busChannels = useRef<Channel[] | null[]>([null, null]);
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
    Object.values(currentBusFx).forEach((fx) => {
      console.log("fx", fx);
      switch (fx) {
        case "nofx1":
          busChannels.current[0] && busChannels.current[0].disconnect();
          busChannels.current[0] = new Channel().connect(Destination);
          break;
        case "nofx2":
          busChannels.current[1] && busChannels.current[1].disconnect();
          busChannels.current[1] = new Channel().connect(Destination);
          break;
        case "reverb1":
          busChannels.current[0] && busChannels.current[0].disconnect();
          busChannels.current[0] = new Channel().connect(busFx.reverb1);
          busChannels.current[0].receive("reverb1");
          break;
        case "reverb2":
          busChannels.current[1] && busChannels.current[1].disconnect();
          busChannels.current[1] = new Channel().connect(busFx.reverb2);
          busChannels.current[1].receive("reverb2");
          break;
        case "delay1":
          busChannels.current[0] && busChannels.current[0].disconnect();
          busChannels.current[0] = new Channel().connect(busFx.delay1);
          busChannels.current[0].receive("delay1");
          break;
        case "delay2":
          busChannels.current[1] && busChannels.current[1].disconnect();
          busChannels.current[1] = new Channel().connect(busFx.delay2);
          busChannels.current[1].receive("delay2");
          break;
        default:
          break;
      }
    });
  }, [currentBusFx, busFx]);

  return [busChannels, currentBusFx, disabled];
}

export default useBusFx;

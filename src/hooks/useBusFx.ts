import { useEffect, useRef } from "react";
import { Channel } from "tone";
import { array } from "../utils";
import { shallowEqual } from "@xstate/react";
import { MixerMachineContext } from "../App";

function useBusFx({ busFx }: any) {
  const busChannels = useRef<Channel[] | null[]>([null, null]);
  const currentBusFx = MixerMachineContext.useSelector((state) => {
    const { currentBusFx } = state.context;
    return currentBusFx;
  }, shallowEqual);

  const disabled = {
    panel1: currentBusFx.bus1fx1 === "nofx" && currentBusFx.bus1fx2 === "nofx",
    panel2: currentBusFx.bus2fx1 === "nofx" && currentBusFx.bus2fx2 === "nofx",
  };

  useEffect(() => {
    array(2).forEach((_, i) => {
      switch (currentBusFx[`bus${i + 1}fx${i + 1}`]) {
        case "nofx1":
          busChannels.current[0] && busChannels.current[0].disconnect();
          busChannels.current[0] = new Channel();
          break;
        case "nofx2":
          busChannels.current[1] && busChannels.current[1].disconnect();
          busChannels.current[1] = new Channel();
          break;
        case "reverb1":
          busChannels.current[0] && busChannels.current[0].disconnect();
          busChannels.current[0] = new Channel().connect(busFx.current.reverb1);
          busChannels.current[0].receive("reverb1");
          break;
        case "reverb2":
          busChannels.current[1] && busChannels.current[1].disconnect();
          busChannels.current[1] = new Channel().connect(busFx.current.reverb2);
          busChannels.current[1].receive("reverb2");
          break;
        case "delay1":
          busChannels.current[0] && busChannels.current[0].disconnect();
          busChannels.current[0] = new Channel().connect(busFx.current.delay1);
          busChannels.current[0].receive("delay1");
          break;
        case "delay2":
          busChannels.current[1] && busChannels.current[1].disconnect();
          busChannels.current[1] = new Channel().connect(busFx.current.delay2);
          busChannels.current[1].receive("delay2");
          break;
        default:
          break;
      }
    });

    return () => {
      busChannels.current.forEach((busChannel) => busChannel?.dispose());
      busChannels.current = [null, null];
    };
  }, [currentBusFx, busFx]);

  return [busChannels, currentBusFx, disabled];
}

export default useBusFx;

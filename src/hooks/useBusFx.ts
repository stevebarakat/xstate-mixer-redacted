import { useEffect, useRef } from "react";
import { Destination, Gain, ScaleExp } from "tone";

function useBusFx() {
  const scaleExp = useRef<ScaleExp | null>(null);
  const busChannels = useRef<BusChannel[]>([null, null]);

  useEffect(() => {
    scaleExp.current = new ScaleExp(0, 1, 0.5);
    busChannels.current[0]?.disconnect(Destination);
    busChannels.current[0] = new Gain(0)
      .connect(scaleExp.current)
      .toDestination();
    busChannels.current[1]?.disconnect(Destination);
    busChannels.current[1] = new Gain(0)
      .connect(scaleExp.current)
      .toDestination();

    return () => {
      scaleExp.current?.dispose();
      busChannels.current.forEach((busChannel) => busChannel?.dispose());
      busChannels.current = [null, null];
    };
  }, []);

  return [busChannels];
}

export default useBusFx;

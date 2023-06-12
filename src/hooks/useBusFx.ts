import { useEffect, useRef } from "react";
import { Gain, ScaleExp } from "tone";

function useBusFx() {
  const scaleExp = useRef<ScaleExp | null>(null);
  const busChannels = useRef<BusChannel[]>([null, null]);
  const currentMixString = localStorage.getItem("currentMix");
  const currentMix = currentMixString && JSON.parse(currentMixString);
  const busVolumes = currentMix.busVolumes;

  useEffect(() => {
    scaleExp.current = new ScaleExp(0, 1, 0.5);
    busChannels.current[0]?.disconnect();
    busChannels.current[0] = new Gain(busVolumes[0])
      .connect(scaleExp.current)
      .toDestination();
    busChannels.current[1]?.disconnect();
    busChannels.current[1] = new Gain(busVolumes[1])
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

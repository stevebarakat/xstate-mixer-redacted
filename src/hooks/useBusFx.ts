import { useEffect, useRef } from "react";
import { Gain, Destination } from "tone";

function useBusFx() {
  const busChannels = useRef<Gain[]>([
    new Gain().connect(Destination),
    new Gain().connect(Destination),
  ]);

  useEffect(() => {
    busChannels.current[0] = new Gain().connect(Destination);
    busChannels.current[1] = new Gain().connect(Destination);
  }, []);

  return [busChannels];
}

export default useBusFx;

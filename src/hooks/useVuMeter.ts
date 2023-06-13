import type { Destination } from "tone/build/esm/core/context/Destination";
import { MixerMachineContext } from "../App";
import { useEffect, useCallback, useRef, useState } from "react";
import { Meter } from "tone";

type Props = {
  channels: (Destination | Channel | BusChannel)[];
  meters: Meter[];
};

export default function useVuMeter({ channels, meters }: Props) {
  const [state] = MixerMachineContext.useActor();
  console.log('state.matches("playing")', state.matches("playing"));

  const [meterVals, setMeterVals] = useState<Float32Array | undefined>(() => {
    return new Float32Array(4);
  });

  const animation = useRef<number | null>(null);

  // loop recursively to amimateMeters
  const animateMeter = useCallback(() => {
    meters.forEach((meter, i) => {
      const val = meter.getValue();
      if (typeof val === "number") {
        if (!meterVals) return;
        meterVals[i] = val + 85;
        setMeterVals(new Float32Array(meterVals));
      }
    });
    animation.current = requestAnimationFrame(animateMeter);
  }, [meterVals, meters]);

  useEffect(() => {
    if (!channels || !state.matches("playing")) return;
    channels.map((channel, i) => {
      meters[i] = new Meter();
      return channel?.connect(meters[i]);
    });
  }, [channels, meters, state]);

  useEffect(() => {
    requestAnimationFrame(animateMeter);
    return () => {
      animation.current && cancelAnimationFrame(animation.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return meterVals;
}

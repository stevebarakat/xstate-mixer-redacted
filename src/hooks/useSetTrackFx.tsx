import { useState } from "react";
import { Reverb, FeedbackDelay, PitchShift, Gain } from "tone";
import {
  Reverber,
  PitchShifter,
  Delay,
  Signal,
} from "../components/TrackChannel/Fx";

type Fx = {
  1: JSX.Element;
  2: JSX.Element;
};

type Props = {
  trackIndex: number;
  fx: React.MutableRefObject<Fx>;
  reverb: React.MutableRefObject<Reverb | null>;
  delay: React.MutableRefObject<FeedbackDelay | null>;
  pitchShift: React.MutableRefObject<PitchShift | null>;
  gain: React.MutableRefObject<Gain>;
};

function useSetTrackFx({
  fx,
  trackIndex,
  reverb,
  delay,
  pitchShift,
  gain,
}: Props) {
  const currentTracksString = localStorage.getItem("currentTracks");
  const currentTracks = currentTracksString && JSON.parse(currentTracksString);

  const [trackFx, setTrackFx] = useState(() => {
    return (
      currentTracks.fxName ?? Array(currentTracks.length).fill(["nofx", "nofx"])
    );
  });

  function saveTrackFx(e: React.FormEvent<HTMLSelectElement>) {
    const currentTracksString = localStorage.getItem("currentTracks");
    const currentTracks =
      currentTracksString && JSON.parse(currentTracksString);

    const sid = e.currentTarget.id.at(-1) ?? 0;
    const id = parseInt(sid.toString(), 10);
    trackFx[trackIndex][id] = e.currentTarget.value;
    setTrackFx([...trackFx]);

    currentTracks[trackIndex].fxName[id] = e.currentTarget.value;
    localStorage.setItem("currentTracks", JSON.stringify([...currentTracks]));

    switch (e.currentTarget.value) {
      case "nofx":
        fx.current[`${id + 1}` as unknown as keyof Fx] = (
          <Signal gain={gain.current} />
        );
        break;

      case "reverb":
        fx.current[`${id + 1}` as unknown as keyof Fx] = (
          <Reverber reverb={reverb.current} trackIndex={trackIndex} />
        );
        break;

      case "delay":
        fx.current[`${id + 1}` as unknown as keyof Fx] = (
          <Delay delay={delay.current} trackIndex={trackIndex} />
        );
        break;

      case "pitchShift":
        fx.current[`${id + 1}` as unknown as keyof Fx] = (
          <PitchShifter
            pitchShift={pitchShift.current}
            trackIndex={trackIndex}
          />
        );
        break;

      default:
        break;
    }
  }
  return { saveTrackFx };
}

export default useSetTrackFx;

import { useRef } from "react";
import { Reverb, FeedbackDelay, PitchShift, Gain } from "tone";
import TrackReverber from "../components/TrackChannel/Fx/TrackReverber";
import TrackSignal from "../components/TrackChannel/Fx/TrackSignal";
import TrackDelay from "../components/TrackChannel/Fx/TrackDelay";
import TrackPitchShifter from "../components/TrackChannel/Fx/TrackPitchShifter";
import type { Channel } from "tone";
import { array } from "../utils";

type Props = {
  trackIndex: number;
  channels: Channel[];
};

type FxTypes = FeedbackDelay | Reverb | PitchShift | Gain;

function useTrackFx({ channels, trackIndex }: Props) {
  const currentTracksString = localStorage.getItem("currentTracks");
  const currentTracks = currentTracksString && JSON.parse(currentTracksString);
  const ct = currentTracks[trackIndex];
  const channel = channels[trackIndex];

  const gain = useRef<Gain>(new Gain().toDestination());
  const reverb = useRef<Reverb>(
    new Reverb({
      wet: ct.reverbsMix,
      preDelay: ct.reverbsPreDelay,
      decay: ct.reverbsDecay,
    }).toDestination()
  );
  const delay = useRef<FeedbackDelay>(
    new FeedbackDelay({
      wet: ct.delaysMix,
      delayTime: ct.delaysTime,
      feedback: ct.delaysFeedback,
    }).toDestination()
  );
  const pitchShift = useRef<PitchShift>(
    new PitchShift({
      wet: ct.pitchShiftsMix,
      pitch: ct.pitchShiftsPitch,
    }).toDestination()
  );

  const fx = useRef<{ 1: JSX.Element; 2: JSX.Element }>(
    (() => {
      const currentFx = currentTracks[trackIndex]?.fxName ?? null;
      console.log("currentFx", currentFx);

      let fxComponents = {
        1: <TrackSignal gain={gain.current} />,
        2: <TrackSignal gain={gain.current} />,
      };
      array(2).map((_: void, fxIndex: number) => {
        switch (currentFx[fxIndex]) {
          case "nofx":
            fxIndex === 0
              ? (fxComponents = {
                  ...fxComponents,
                  1: <TrackSignal gain={gain.current} />,
                })
              : (fxComponents = {
                  ...fxComponents,
                  2: <TrackSignal gain={gain.current} />,
                });
            break;
          case "reverb":
            fxIndex === 0
              ? (fxComponents = {
                  ...fxComponents,
                  1: (
                    <TrackReverber
                      reverb={reverb.current}
                      trackIndex={trackIndex}
                    />
                  ),
                })
              : (fxComponents = {
                  ...fxComponents,
                  2: (
                    <TrackReverber
                      reverb={reverb.current}
                      trackIndex={trackIndex}
                    />
                  ),
                });
            break;
          case "delay":
            fxIndex === 0
              ? (fxComponents = {
                  ...fxComponents,
                  1: (
                    <TrackDelay delay={delay.current} trackIndex={trackIndex} />
                  ),
                })
              : (fxComponents = {
                  ...fxComponents,
                  2: (
                    <TrackDelay delay={delay.current} trackIndex={trackIndex} />
                  ),
                });
            break;
          case "pitchShift":
            fxIndex === 0
              ? (fxComponents = {
                  ...fxComponents,
                  1: (
                    <TrackPitchShifter
                      pitchShift={pitchShift.current}
                      trackIndex={trackIndex}
                    />
                  ),
                })
              : (fxComponents = {
                  ...fxComponents,
                  2: (
                    <TrackPitchShifter
                      pitchShift={pitchShift.current}
                      trackIndex={trackIndex}
                    />
                  ),
                });
            break;
          default:
            break;
        }
      });
      const fxProps = Object.values(fxComponents).map((fx) => fx.props);
      const fxNodes = fxProps.map((prop) => Object.values(prop)[0]);
      channel.disconnect();
      fxNodes.forEach((node: FxTypes) => {
        channel.chain(node);
      });
      return fxComponents;
    })()
  );

  return { fx, reverb, delay, pitchShift, gain };
}

export default useTrackFx;

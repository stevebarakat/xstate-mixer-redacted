import { useRef } from "react";
import { Reverb, FeedbackDelay, PitchShift, Gain } from "tone";
import { Reverber, Delay, PitchShifter } from "../components/TrackChannel/Fx";
import TrackSignal from "../components/TrackChannel/Fx/NoFx";
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

  const gain = useRef<Gain>(new Gain(0).toDestination());
  const reverb = useRef<Reverb | null>(null);
  const delay = useRef<FeedbackDelay | null>(null);
  const pitchShift = useRef<PitchShift | null>(null);

  const fx = useRef<{ 1: JSX.Element; 2: JSX.Element }>(
    (() => {
      const currentFx = currentTracks[trackIndex]?.fxName ?? null;

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
            reverb.current = new Reverb({
              wet: ct.reverbsMix[fxIndex],
              preDelay: ct.reverbsPreDelay[fxIndex],
              decay: ct.reverbsDecay[fxIndex],
            }).toDestination();
            fxIndex === 0
              ? (fxComponents = {
                  ...fxComponents,
                  1: (
                    <Reverber reverb={reverb.current} trackIndex={trackIndex} />
                  ),
                })
              : (fxComponents = {
                  ...fxComponents,
                  2: (
                    <Reverber reverb={reverb.current} trackIndex={trackIndex} />
                  ),
                });
            break;
          case "delay":
            delay.current = new FeedbackDelay({
              wet: ct.delaysMix[fxIndex],
              delayTime: ct.delaysTime[fxIndex],
              feedback: ct.delaysFeedback[fxIndex],
            }).toDestination();
            fxIndex === 0
              ? (fxComponents = {
                  ...fxComponents,
                  1: <Delay delay={delay.current} trackIndex={trackIndex} />,
                })
              : (fxComponents = {
                  ...fxComponents,
                  2: <Delay delay={delay.current} trackIndex={trackIndex} />,
                });
            break;
          case "pitchShift":
            pitchShift.current = new PitchShift({
              wet: ct.pitchShiftsMix[fxIndex],
              pitch: ct.pitchShiftsPitch[fxIndex],
            }).toDestination();
            fxIndex === 0
              ? (fxComponents = {
                  ...fxComponents,
                  1: (
                    <PitchShifter
                      pitchShift={pitchShift.current}
                      trackIndex={trackIndex}
                    />
                  ),
                })
              : (fxComponents = {
                  ...fxComponents,
                  2: (
                    <PitchShifter
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
      // channel.disconnect();
      fxNodes.forEach((node: FxTypes) => {
        channel.chain(node);
      });
      return fxComponents;
    })()
  );

  return { fx, reverb, delay, pitchShift, gain };
}

export default useTrackFx;

import { useRef, useState } from "react";
import { Reverb, FeedbackDelay, PitchShift, Gain } from "tone";
import TrackPanel from "./TrackPanel";
import TrackReverber from "./Fx/TrackReverber";
import TrackSignal from "./Fx/TrackSignal";
import TrackDelay from "./Fx/TrackDelay";
import TrackPitchShifter from "./Fx/TrackPitchShifter";
import ChannelButton from "../Buttons/ChannelButton";
import Pan from "./Pan";
import SoloMute from "./SoloMute";
import Sends from "./Sends";
import Fader from "./Fader";
import ChannelLabel from "../ChannelLabel";
import type { SourceTrack } from "../../types/global";
import type { Channel } from "tone";
import { array } from "../../utils";

type Props = {
  track: SourceTrack;
  trackIndex: number;
  channels: Channel[];
};

type Fx = {
  1: JSX.Element;
  2: JSX.Element;
};

type FxTypes = FeedbackDelay | Reverb | PitchShift | Gain;

function TrackChannel({ track, trackIndex, channels }: Props) {
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

  const fx = useRef<Fx>(
    (() => {
      const currentFx = currentTracks[trackIndex]?.fxName ?? null;
      console.log("currentFx", currentFx);

      let fxComponents = {
        1: <TrackSignal gain={gain.current} />,
        2: <TrackSignal gain={gain.current} />,
      };
      array(2).map((_, fxIndex) => {
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

  console.log("fx.current", fx.current);

  const [trackFx, setTrackFx] = useState(() => {
    return (
      currentTracks.fxName ?? Array(currentTracks.length).fill(["nofx", "nofx"])
    );
  });

  const [active, setActive] = useState([true, true, true, true]);

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

    console.log("id", id);
    switch (e.currentTarget.value) {
      case "nofx":
        fx.current[`${id + 1}` as unknown as keyof Fx] = (
          <TrackSignal gain={gain.current} />
        );
        break;

      case "reverb":
        fx.current[`${id + 1}` as unknown as keyof Fx] = (
          <TrackReverber reverb={reverb.current} trackIndex={trackIndex} />
        );
        break;

      case "delay":
        fx.current[`${id + 1}` as unknown as keyof Fx] = (
          <TrackDelay delay={delay.current} trackIndex={trackIndex} />
        );
        break;

      case "pitchShift":
        fx.current[`${id + 1}` as unknown as keyof Fx] = (
          <TrackPitchShifter
            pitchShift={pitchShift.current}
            trackIndex={trackIndex}
          />
        );
        break;

      default:
        break;
    }

    const fxProps = Object.values(fx.current).map((fx) => fx.props);
    const fxNodes = fxProps.map((prop) => Object.values(prop)[0]);
    channel.disconnect();
    fxNodes.forEach((node: FxTypes) => {
      channel.chain(node);
    });
  }

  const disabled = currentTracks[trackIndex].fxName.every(
    (item: string) => item === "nofx"
  );

  const trackPanelsEmpty = ct.fxName.every((name: string) => name === "nofx");

  function getTrackPanels() {
    if (trackPanelsEmpty) {
      return null;
    } else {
      return (
        <TrackPanel
          trackIndex={trackIndex}
          active={active}
          setActive={setActive}
        >
          {fx.current["1"]}
          {fx.current["2"]}
        </TrackPanel>
      );
    }
  }

  return (
    <div className="flex-y gap2">
      <ChannelButton
        className="fx-select"
        disabled={disabled}
        onClick={() => {
          active[trackIndex] = !active[trackIndex];
          setActive([...active]);
        }}
      >
        {disabled ? "No" : active[trackIndex] ? "Close" : "Open"}
        FX
      </ChannelButton>
      {array(2).map((_, fxIndex) => (
        <select
          key={fxIndex}
          id={`track${trackIndex}fx${fxIndex}`}
          className="fx-select"
          onChange={saveTrackFx}
          value={currentTracks[trackIndex]?.fxName[fxIndex]}
        >
          <option value={"nofx"}>{`FX ${fxIndex + 1}`}</option>
          <option value={"reverb"}>Reverb</option>
          <option value={"delay"}>Delay</option>
          <option value={"pitchShift"}>Pitch Shift</option>
        </select>
      ))}
      <>{active[trackIndex] && getTrackPanels()}</>
      <div className="channel">
        <Sends trackIndex={trackIndex} channels={channels} />
        <Pan trackIndex={trackIndex} channel={channel} />
        <Fader trackIndex={trackIndex} channel={channel} />
        <SoloMute trackIndex={trackIndex} channel={channel} />
        <ChannelLabel channelName={track.name} />
      </div>
    </div>
  );
}

export default TrackChannel;

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

      let ubu = {
        1: <TrackSignal gain={gain.current} />,
        2: <TrackSignal gain={gain.current} />,
      };
      array(2).map((_, fxIndex) => {
        switch (currentFx[fxIndex]) {
          case "nofx":
            fxIndex === 0
              ? (ubu = {
                  ...ubu,
                  1: <TrackSignal gain={gain.current} />,
                })
              : (ubu = {
                  ...ubu,
                  2: <TrackSignal gain={gain.current} />,
                });
            break;
          case "reverb":
            fxIndex === 0
              ? (ubu = {
                  ...ubu,
                  1: (
                    <TrackReverber
                      reverb={reverb.current}
                      trackIndex={trackIndex}
                    />
                  ),
                })
              : (ubu = {
                  ...ubu,
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
              ? (ubu = {
                  ...ubu,
                  1: (
                    <TrackDelay delay={delay.current} trackIndex={trackIndex} />
                  ),
                })
              : (ubu = {
                  ...ubu,
                  2: (
                    <TrackDelay delay={delay.current} trackIndex={trackIndex} />
                  ),
                });
            break;
          case "pitchShift":
            fxIndex === 0
              ? (ubu = {
                  ...ubu,
                  1: (
                    <TrackPitchShifter
                      pitchShift={pitchShift.current}
                      trackIndex={trackIndex}
                    />
                  ),
                })
              : (ubu = {
                  ...ubu,
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
      return ubu;
    })()
  );

  console.log("fx.current", fx.current);

  const [trackFx, setTrackFx] = useState(() => {
    return (
      currentTracks.fxName ?? Array(currentTracks.length).fill(["nofx", "nofx"])
    );
  });

  const [active, setActive] = useState([true, true, true, true]);

  const props = useRef<React.MutableRefObject<string[]> | undefined>();

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
        fx.current[`${id + 1}`] = <TrackSignal gain={gain.current} />;
        break;

      case "reverb":
        // channel.disconnect();

        fx.current[`${id + 1}`] = (
          <TrackReverber reverb={reverb.current} trackIndex={trackIndex} />
        );
        break;

      case "delay":
        // channel.disconnect();

        fx.current[`${id + 1}`] = (
          <TrackDelay delay={delay.current} trackIndex={trackIndex} />
        );
        break;

      case "pitchShift":
        // channel.disconnect();

        fx.current[`${id + 1}`] = (
          <TrackPitchShifter
            pitchShift={pitchShift.current}
            trackIndex={trackIndex}
          />
        );
        break;

      default:
        break;
    }

    const ebu = Object.values(fx.current).map((fx) => fx.props);
    console.log("ebu", ebu);
    const abu = ebu.map((item) => Object.values(item)[0]);
    console.log("abu", abu);
    channel.disconnect();
    abu.forEach((item) => {
      console.log("item", item);
      channel.chain(item);
    });
    // props.current = fx.current[`${id + 1}`]?.props;
    // console.log("Object.values(props)[0]", Object.values(props.current)[0]);
    // channel.disconnect();
    // channel.chain(Object.values(props.current)[0]);
    // console.log("fx.current[id].props", fx.current[`${id + 1}`].props);
  }

  const disabled = currentTracks[trackIndex].fxName.every(
    (item: string) => item === "nofx"
  );

  console.log("typeof fx.current", Object.values(fx.current["1"].props));

  props.current = Object.values(fx.current["1"].props);
  // console.log("props.current[0] === Gain", props.current[0]);

  console.log("fx.current[1] === Gain", props.current[0] === typeof Gain);

  function getTrackPanels() {
    if (!fx.current) {
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

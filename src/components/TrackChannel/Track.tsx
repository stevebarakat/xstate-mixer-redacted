import { useRef, useState } from "react";
import { Reverb, FeedbackDelay, PitchShift } from "tone";
import TrackReverber from "./Fx/TrackReverber";
import TrackPanel from "./TrackPanel";
import TrackDelay from "./Fx/TrackDelay";
import ChannelButton from "../Buttons/ChannelButton";
import TrackPitchShifter from "./Fx/TrackPitchShifter";
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

  // const fx = useRef<Fx>(
  //   (() => {
  //     const currentFx1 = currentTracks[trackIndex]?.fxName ?? null;
  //     console.log("currentFx1", currentFx1);
  //     switch (currentFx1) {
  //       case "reverb":
  //         // channel.disconnect();
  //         channel.connect(reverb.current);
  //         return [
  //           <TrackReverber reverb={reverb.current} trackIndex={trackIndex} />,
  //         ];
  //       case "delay":
  //         // channel.disconnect();
  //         channel.connect(delay.current);
  //         return [<TrackDelay delay={delay.current} trackIndex={trackIndex} />];
  //       case "pitchShift":
  //         // channel.disconnect();
  //         channel.connect(pitchShift.current);
  //         return [
  //           <TrackPitchShifter
  //             pitchShift={pitchShift.current}
  //             trackIndex={trackIndex}
  //           />,
  //         ];
  //       default:
  //         return [undefined];
  //         break;
  //     }
  //   })()
  // );

  const fx = useRef<Fx>(
    (() => {
      const currentFx = currentTracks[trackIndex]?.fxName ?? null;
      console.log("currentFx", currentFx);

      let ubu = { 1: <div />, 2: <div /> };
      array(2).forEach((_, fxIndex) => {
        switch (currentFx[fxIndex]) {
          case "reverb":
            ubu = {
              ...ubu,
              1: (
                <TrackReverber
                  reverb={reverb.current}
                  trackIndex={trackIndex}
                />
              ),
            };
            break;
          case "delay":
            ubu = {
              ...ubu,
              1: <TrackDelay delay={delay.current} trackIndex={trackIndex} />,
            };
            break;
          case "pitchShift":
            ubu = {
              ...ubu,
              1: (
                <TrackPitchShifter
                  pitchShift={pitchShift.current}
                  trackIndex={trackIndex}
                />
              ),
            };
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
        channel.disconnect();
        channel.toDestination();
        fx.current[`${id + 1}`] = undefined;
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
    const props = fx.current[`${id + 1}`].props;
    channel.chain(Object.values(props)[0]);
    // console.log("fx.current[id].props", fx.current[`${id + 1}`].props);
    // console.log("Object.values(props)", Object.values(props)[0]);
  }

  const disabled = currentTracks[trackIndex].fxName.every(
    (item: string) => item === "nofx"
  );

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

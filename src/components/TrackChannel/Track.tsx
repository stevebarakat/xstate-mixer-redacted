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
import { array as fx } from "../../utils";

type Props = {
  track: SourceTrack;
  trackIndex: number;
  channels: Channel[];
};

function TrackChannel({ track, trackIndex, channels }: Props) {
  const channel = channels[trackIndex];
  const reverb = useRef<Reverb>(new Reverb(8).toDestination());
  const delay = useRef<FeedbackDelay>(new FeedbackDelay().toDestination());
  const pitchShift = useRef<PitchShift>(new PitchShift().toDestination());

  const currentTracksString = localStorage.getItem("currentTracks");
  const currentTracks = currentTracksString && JSON.parse(currentTracksString);

  const fx1 = useRef<JSX.Element | undefined>(
    (() => {
      const currentFx = currentTracks[trackIndex]?.fx ?? null;
      switch (currentFx) {
        case "reverb":
          return (
            <TrackReverber reverb={reverb.current} trackIndex={trackIndex} />
          );
        case "delay":
          return <TrackDelay delay={delay.current} trackIndex={trackIndex} />;
        case "pitchShift":
          return (
            <TrackPitchShifter
              pitchShift={pitchShift.current}
              trackIndex={trackIndex}
            />
          );
        default:
          break;
      }
    })()
  );

  const fx2 = useRef<JSX.Element | undefined>(
    (() => {
      const currentFx = currentTracks[trackIndex]?.fx ?? null;
      switch (currentFx) {
        case "reverb":
          return (
            <TrackReverber reverb={reverb.current} trackIndex={trackIndex} />
          );
        case "delay":
          return <TrackDelay delay={delay.current} trackIndex={trackIndex} />;
        case "pitchShift":
          return (
            <TrackPitchShifter
              pitchShift={pitchShift.current}
              trackIndex={trackIndex}
            />
          );
        default:
          break;
      }
    })()
  );

  const [trackFx, setTrackFx] = useState(() => {
    return (
      currentTracks.fx ?? Array(currentTracks.length).fill(["nofx", "nofx"])
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

    currentTracks[trackIndex].fx[id] = e.currentTarget.value;
    localStorage.setItem("currentTracks", JSON.stringify([...currentTracks]));

    channel.disconnect();
    switch (e.currentTarget.value) {
      case "nofx":
        channel.toDestination();
        id === 0 ? (fx1.current = undefined) : (fx2.current = undefined);
        break;

      case "reverb":
        channel.connect(reverb.current);

        if (id === 0) {
          fx1.current = (
            <TrackReverber reverb={reverb.current} trackIndex={trackIndex} />
          );
        } else {
          fx2.current = (
            <TrackReverber reverb={reverb.current} trackIndex={trackIndex} />
          );
        }
        break;

      case "delay":
        channel.connect(delay.current);

        if (id === 0) {
          fx1.current = (
            <TrackDelay delay={delay.current} trackIndex={trackIndex} />
          );
          localStorage.setItem("fx1.current", "delay");
        } else {
          fx2.current = (
            <TrackDelay delay={delay.current} trackIndex={trackIndex} />
          );
          localStorage.setItem("fx2.current", "delay");
        }
        break;

      case "pitchShift":
        channel.connect(pitchShift.current);

        if (id === 0) {
          fx1.current = (
            <TrackPitchShifter
              pitchShift={pitchShift.current}
              trackIndex={trackIndex}
            />
          );
          localStorage.setItem("fx1.current", "pitchShift");
        } else {
          fx2.current = (
            <TrackPitchShifter
              pitchShift={pitchShift.current}
              trackIndex={trackIndex}
            />
          );
          localStorage.setItem("fx2.current", "pitchShift");
        }
        break;

      default:
        break;
    }
  }

  const disabled = currentTracks[trackIndex].fx.every(
    (item: string) => item === "nofx"
  );

  function getTrackPanels() {
    if (!fx1.current && !fx2.current) {
      return null;
    } else {
      return (
        <TrackPanel
          trackIndex={trackIndex}
          active={active}
          setActive={setActive}
        >
          {fx1.current}
          {fx2.current}
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
      {fx(2).map((_, fxIndex) => (
        <select
          key={fxIndex}
          id={`track${trackIndex}fx${fxIndex}`}
          className="fx-select"
          onChange={saveTrackFx}
          value={currentTracks[trackIndex]?.fx[fxIndex]}
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

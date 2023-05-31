import { useRef, useState } from "react";
import { Reverb, FeedbackDelay, PitchShift, Destination } from "tone";
import TrackReverber from "./Fx/TrackReverber";
import TrackPanel from "./TrackPanel";
import TrackDelay from "./Fx/TrackDelay";
import ChannelButton from "./Buttons/ChannelButton";
import PitchShifter from "./Fx/PitchShifter";
import Pan from "./Pan";
import SoloMute from "./SoloMute";
import Sends from "./Sends";
import Fader from "./Fader";
import TrackLabel from "./TrackLabel";
import type { Track } from "../types/global";
import type { Channel } from "tone";
import { array as fx } from "../utils";

type Props = {
  track: Track;
  trackIndex: number;
  channels: Channel[];
};

function ChannelStrip({ track, trackIndex, channels }: Props) {
  const channel = channels[trackIndex];
  const reverb = useRef<Reverb>(new Reverb(8).toDestination());
  const delay = useRef<FeedbackDelay>(new FeedbackDelay().toDestination());
  const pitchShift = useRef<PitchShift>(new PitchShift().toDestination());

  const currentTracksString = localStorage.getItem("currentTracks");
  const currentTracks = currentTracksString && JSON.parse(currentTracksString);

  const [fx1, setFx1] = useState<JSX.Element | null>(() => {
    const currentFx = currentTracks[trackIndex].fx[0] ?? null;
    switch (currentFx) {
      case "reverb":
        return <TrackReverber reverb={reverb.current} trackIndex={0} />;
      case "delay":
        return <TrackDelay delay={delay.current} trackIndex={0} />;
      case "pitchShift":
        return <PitchShifter pitchShift={pitchShift.current} trackIndex={0} />;
      default:
        break;
    }
  });

  const [fx2, setFx2] = useState<JSX.Element | null>(() => {
    const currentFx = currentTracks[trackIndex].fx[1] ?? null;
    switch (currentFx) {
      case "reverb":
        return <TrackReverber reverb={reverb.current} trackIndex={1} />;
      case "delay":
        return <TrackDelay delay={delay.current} trackIndex={1} />;
      case "pitchShift":
        return <PitchShifter pitchShift={pitchShift.current} trackIndex={1} />;
      default:
        break;
    }
  });

  const [trackFx, setTrackFx] = useState(() => {
    return (
      currentTracks.fx ?? [
        ["nofx", "nofx"],
        ["nofx", "nofx"],
        ["nofx", "nofx"],
        ["nofx", "nofx"],
      ]
    );
  });

  const [active, setActive] = useState([true, true, true, true]);

  function saveTrackFx(e: React.FormEvent<HTMLSelectElement>) {
    const currentTracksString = localStorage.getItem("currentTracks");
    const currentTracks =
      currentTracksString && JSON.parse(currentTracksString);

    console.log("e.currentTarget.id.at(-1)", e.currentTarget.id.at(-1));
    const id = parseInt(e.currentTarget.id.at(-1)!, 10);
    trackFx[trackIndex][id] = e.currentTarget.value;
    setTrackFx([...trackFx]);

    currentTracks[trackIndex].fx[id] = e.currentTarget.value;
    localStorage.setItem("currentTracks", JSON.stringify([...currentTracks]));

    switch (e.currentTarget.value) {
      case "nofx":
        channel.disconnect();
        channel.connect(Destination);
        id === 0 ? setFx1(null) : setFx2(null);

        break;

      case "reverb":
        channel.disconnect();
        channel.connect(reverb.current).toDestination();

        if (id === 0) {
          setFx1(<TrackReverber reverb={reverb.current} trackIndex={0} />);
          localStorage.setItem("fx1", "reverb");
        } else {
          setFx2(<TrackReverber reverb={reverb.current} trackIndex={1} />);
          localStorage.setItem("fx2", "reverb");
        }

        break;

      case "delay":
        channel.disconnect();
        channel.connect(delay.current).toDestination();

        if (id === 0) {
          setFx1(<TrackDelay delay={delay.current} trackIndex={0} />);
          localStorage.setItem("fx1", "delay");
        } else {
          setFx2(<TrackDelay delay={delay.current} trackIndex={1} />);
          localStorage.setItem("fx2", "delay");
        }
        break;

      case "pitchShift":
        channel.disconnect();
        channel.connect(pitchShift.current).toDestination();

        if (id === 0) {
          setFx1(
            <PitchShifter pitchShift={pitchShift.current} trackIndex={0} />
          );
          localStorage.setItem("fx1", "pitchShift");
        } else {
          setFx2(
            <PitchShifter pitchShift={pitchShift.current} trackIndex={1} />
          );
          localStorage.setItem("fx2", "pitchShift");
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
    if (!fx1 && !fx2) {
      return null;
    } else {
      return (
        <TrackPanel
          trackIndex={trackIndex}
          active={active}
          setActive={setActive}
        >
          {fx1}
          {fx2}
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
          value={currentTracks[trackIndex].fx[fxIndex]}
        >
          <option value={"nofx"}>{`FX ${fxIndex + 1}`}</option>
          <option value={"reverb"}>Reverb</option>
          <option value={"delay"}>Delay</option>
          <option value={"pitchShift"}>Pitch Shift</option>
        </select>
      ))}
      <div className="channel">
        <>{active[trackIndex] && getTrackPanels()}</>
        <Sends trackIndex={trackIndex} channels={channels} />
        <Pan trackIndex={trackIndex} channel={channel} />
        <Fader trackIndex={trackIndex} channel={channel} />
        <SoloMute trackIndex={trackIndex} channel={channel} />
        <TrackLabel trackName={track.name} />
      </div>
    </div>
  );
}

export default ChannelStrip;

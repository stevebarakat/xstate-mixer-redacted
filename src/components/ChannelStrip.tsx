import { useRef, useState } from "react";
import { Reverb, FeedbackDelay, PitchShift, Destination } from "tone";
import TrackReverber from "./Fx/TrackReverber";
import TrackDelay from "./Fx/TrackDelay";
import CloseButton from "./Buttons/CloseButton";
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
import { Rnd as TrackFxPanel } from "react-rnd";

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

  console.log(
    JSON.parse(localStorage.getItem("currentTracks")!)[trackIndex].fx
  );
  const [fx1, setFx1] = useState<JSX.Element | null>(null);
  const [fx2, setFx2] = useState<JSX.Element | null>(null);
  const [trackFx, setTrackFx] = useState(() => {
    return (
      JSON.parse(localStorage.getItem("currentTracks")!).fx ?? [
        ["nofx", "nofx"],
        ["nofx", "nofx"],
        ["nofx", "nofx"],
        ["nofx", "nofx"],
      ]
    );
  });
  const [position, setPosition] = useState([
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ]);
  const [size, setSize] = useState([
    { width: "325px", height: "auto" },
    { width: "325px", height: "auto" },
    { width: "325px", height: "auto" },
    { width: "325px", height: "auto" },
  ]);
  const [active, setActive] = useState([false, false, false, false]);

  function saveTrackFx(e: React.FormEvent<HTMLSelectElement>) {
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

        id === 0
          ? setFx1(<TrackReverber reverb={reverb.current} trackIndex={0} />)
          : setFx2(<TrackReverber reverb={reverb.current} trackIndex={1} />);
        break;

      case "delay":
        channel.disconnect();
        channel.connect(delay.current).toDestination();

        id === 0
          ? setFx1(<TrackDelay delay={delay.current} trackIndex={0} />)
          : setFx2(<TrackDelay delay={delay.current} trackIndex={1} />);
        break;

      case "pitchShift":
        channel.disconnect();
        channel.connect(pitchShift.current).toDestination();

        id === 0
          ? setFx1(
              <PitchShifter pitchShift={pitchShift.current} trackIndex={0} />
            )
          : setFx2(
              <PitchShifter pitchShift={pitchShift.current} trackIndex={1} />
            );
        break;

      default:
        break;
    }
  }

  console.log("trackPanelPosition", position[trackIndex]);

  function getTrackPanels() {
    if (!fx1 && !fx2) {
      return null;
    } else {
      return (
        <TrackFxPanel
          className="fx-panel"
          position={position[trackIndex]}
          onDragStop={(_, d) => {
            position[trackIndex] = { x: d.x, y: d.y };
            setPosition([...position]);
          }}
          size={size[trackIndex]}
          minWidth="200px"
          onResizeStop={(_, __, ref) => {
            size[trackIndex] = {
              width: ref.style.width,
              height: ref.style.height,
            };
            setSize([...size]);
          }}
          cancel="input"
        >
          <CloseButton
            onClick={() => {
              active[trackIndex] = !active[trackIndex];
              setActive([...active]);
            }}
          >
            X
          </CloseButton>
          {fx1}
          {fx2}
        </TrackFxPanel>
      );
    }
  }

  return (
    <div className="flex-y gap2">
      <ChannelButton
        className="fx-select"
        onClick={() => {
          active[trackIndex] = !active[trackIndex];
          setActive([...active]);
        }}
      >
        {active[trackIndex] ? "Close" : "Open"}
        FX
      </ChannelButton>
      {fx(2).map((_, fxIndex) => (
        <select
          key={fxIndex}
          id={`track${trackIndex}fx${fxIndex}`}
          className="fx-select"
          onChange={saveTrackFx}
          value={
            JSON.parse(localStorage.getItem("currentTracks")!)[trackIndex].fx[
              fxIndex
            ]
          }
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

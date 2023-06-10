import { useState } from "react";
import { Reverb, FeedbackDelay, PitchShift, Gain } from "tone";
import useSetTrackFx from "../../hooks/useSetTrackFx";
import ChannelButton from "../Buttons/ChannelButton";
import { Pan, SoloMute, Sends, Fader, TrackPanel } from "./";
import useTrackFx from "../../hooks/useTrackFx";
import ChannelLabel from "../ChannelLabel";
import type { SourceTrack } from "../../types/global";
import type { Channel } from "tone";

type Props = {
  track: SourceTrack;
  trackIndex: number;
  channels: Channel[];
  busChannels: Gain[];
};

function TrackChannel({ track, trackIndex, channels, busChannels }: Props) {
  const { fx, reverb, delay, pitchShift, gain } = useTrackFx({
    channels,
    trackIndex,
  });

  const { saveTrackFx } = useSetTrackFx({
    reverb,
    delay,
    pitchShift,
    gain,
    trackIndex,
    fx,
  });

  const currentTracksString = localStorage.getItem("currentTracks");
  const currentTracks = currentTracksString && JSON.parse(currentTracksString);
  const ct = currentTracks[trackIndex];
  const channel = channels[trackIndex];

  const [active, setActive] = useState([true, true, true, true]);

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
      {busChannels.map((_, fxIndex) => (
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
        <Sends
          trackIndex={trackIndex}
          channels={channels}
          busChannels={busChannels}
        />
        <Pan trackIndex={trackIndex} channel={channel} />
        <Fader trackIndex={trackIndex} channel={channel} />
        <SoloMute trackIndex={trackIndex} channel={channel} />
        <ChannelLabel channelName={track.name} />
      </div>
    </div>
  );
}

export default TrackChannel;

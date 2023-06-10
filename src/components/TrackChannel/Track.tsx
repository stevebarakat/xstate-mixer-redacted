import { useState } from "react";
import { Pan, SoloMute, Sends, Fader } from "./";
import ChannelLabel from "../ChannelLabel";
import FxSelect from "./FxSelect";
import useSetTrackFx from "../../hooks/useSetTrackFx";
import useTrackFx from "../../hooks/useTrackFx";
import TrackPanels from "../../hooks/TrackPanels";
import type { SourceTrack } from "../../types/global";
import type { Gain, Channel } from "tone";

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

  const channel = channels[trackIndex];

  const [active, setActive] = useState([true, true, true, true]);

  return (
    <div className="flex-y gap2">
      <FxSelect
        active={active}
        setActive={setActive}
        trackIndex={trackIndex}
        busChannels={busChannels}
        saveTrackFx={saveTrackFx}
      />
      <>
        {active[trackIndex] && (
          <TrackPanels
            fx={fx}
            trackIndex={trackIndex}
            active={active}
            setActive={setActive}
          />
        )}
      </>
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

import { useEffect } from "react";
import { Destination, Gain } from "tone";
import useBusFx from "../hooks/useBusFx";
import useChannelStrip from "../hooks/useChannelStrip";
import Transport from "./Transport";
import Loader from "./Loader";
import SongInfo from "./SongInfo";
import TrackChannel from "./TrackChannel/Track";
import Main from "./Main";
import BusChannel from "./BusChannel";
import { MixerMachineContext } from "../App";
import type { Song, TrackSettings } from "../types/global";
import { log, dbToPercent } from "../utils/scale";

type Props = {
  song: Song;
};

export const Mixer = ({ song }: Props) => {
  const currentTracksString = localStorage.getItem("currentTracks");
  const currentTracks = currentTracksString && JSON.parse(currentTracksString);

  const currentMixString = localStorage.getItem("currentMix");
  const currentMix = currentMixString && JSON.parse(currentMixString);

  const isLoading = MixerMachineContext.useSelector((state) =>
    state.matches("loading")
  );
  const tracks = song.tracks;
  const { channels } = useChannelStrip({ tracks });

  const [busChannels] = useBusFx();

  function init() {
    const volume = currentMix.mainVolume;
    const scaled = dbToPercent(log(volume));
    Destination.volume.value = scaled;

    currentTracks.forEach((currentTrack: TrackSettings, trackIndex: number) => {
      const value = currentTrack.volume;
      const scaled = dbToPercent(log(value));

      if (channels[trackIndex]) {
        channels[trackIndex].set({ pan: currentTrack.pan });
        channels[trackIndex].set({ volume: scaled });
      }
    });
  }

  useEffect(() => {
    currentTracks.forEach((currentTrack: TrackSettings, trackIndex: number) => {
      currentTrack.sends?.forEach((send) => {
        if (send === true) {
          channels.forEach((_, i) => {
            if (!busChannels.current[i]) return;
            channels[trackIndex].connect(busChannels.current[i]!);
          });
        }
      });
    });
  }, [busChannels, channels, currentTracks]);

  if (isLoading) {
    init();
    return <Loader song={song} />;
  } else {
    return (
      <div className="mixer">
        <SongInfo song={song} />

        <div className="channels">
          <div>
            {tracks.map((track, i) => (
              <TrackChannel
                key={track.path}
                track={track}
                trackIndex={i}
                channels={channels}
                busChannels={busChannels.current}
              />
            ))}
          </div>
          {busChannels.current.map((_: Gain | undefined, i: number) => (
            <BusChannel
              key={i}
              busChannels={busChannels.current}
              busIndex={i}
            />
          ))}
          <Main />
        </div>
        <Transport song={song} />
      </div>
    );
  }
};

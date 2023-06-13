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
import { log, dbToPercent } from "../utils/scale";

type Props = {
  sourceSong: SourceSong;
};

export const Mixer = ({ sourceSong }: Props) => {
  const currentTracksString = localStorage.getItem("currentTracks");
  const currentTracks = currentTracksString && JSON.parse(currentTracksString);

  const currentMixString = localStorage.getItem("currentMix");
  const currentMix = currentMixString && JSON.parse(currentMixString);

  const isLoading = MixerMachineContext.useSelector((state) =>
    state.matches("loading")
  );
  const tracks = sourceSong.tracks;
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
      currentTrack.sends?.forEach((send, busIndex) => {
        if (
          send === true &&
          busChannels.current[busIndex] &&
          channels[trackIndex]
        ) {
          channels[trackIndex].disconnect();
          channels[trackIndex].connect(busChannels.current[busIndex]!);
        }
      });
    });
  }, [busChannels, channels, currentTracks]);

  if (isLoading) {
    init();
    return <Loader song={sourceSong} />;
  } else {
    return (
      <div className="mixer">
        <SongInfo song={sourceSong} />

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
          {busChannels.current.map((_: Gain | null, i: number) => (
            <BusChannel
              key={i}
              busChannels={busChannels.current}
              busIndex={i}
            />
          ))}
          <Main />
        </div>
        <Transport song={sourceSong} />
      </div>
    );
  }
};

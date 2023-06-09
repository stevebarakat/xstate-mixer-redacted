import { useRef, useEffect } from "react";
import { Destination, Reverb, FeedbackDelay } from "tone";
import useChannelStrip from "../hooks/useChannelStrip";
import useBusFx from "../hooks/useBusFx";
import Transport from "./Transport";
import BusPanels from "./BusChannel/Panels";
import Loader from "./Loader";
import SongInfo from "./SongInfo";
import TrackChannel from "./TrackChannel/Track";
import Main from "./Main";
import BusChannel from "./BusChannel/Bus";
import { MixerMachineContext } from "../App";
import type { Song, TrackSettings } from "../types/global";
import { scale, dBToPercent } from "../utils/scale";

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

  const busFx = useRef({
    reverb1: new Reverb({ decay: 5 }).toDestination(),
    delay1: new FeedbackDelay().toDestination(),
    reverb2: new Reverb({ decay: 5 }).toDestination(),
    delay2: new FeedbackDelay().toDestination(),
  });
  const [busChannels, currentBusFx, disabled] = useBusFx({
    busFx: busFx.current,
  });

  console.log("busChannels", busChannels);
  function init() {
    const volume = currentMix.mainVolume;
    const scaled = dBToPercent(scale(volume));
    Destination.volume.value = scaled;

    currentTracks.forEach((currentTrack: TrackSettings, trackIndex: number) => {
      const value = currentTrack.volume;
      const scaled = dBToPercent(scale(value));

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
            if (busChannels.current[i] === undefined) return;
            channels[trackIndex].connect(busChannels.current[i]);
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
        <BusPanels
          busFx={busFx}
          currentBusFx={currentBusFx}
          disabled={disabled}
        />
        <div className="channels">
          <div>
            {tracks.map((track, i) => (
              <TrackChannel
                key={track.path}
                track={track}
                trackIndex={i}
                channels={channels}
              />
            ))}
          </div>
          {busChannels.current.map((_: void, i: number) => (
            <BusChannel
              key={i}
              busChannels={busChannels.current}
              busIndex={i}
              disabled={disabled}
            />
          ))}
          <Main />
        </div>
        <Transport song={song} />
      </div>
    );
  }
};

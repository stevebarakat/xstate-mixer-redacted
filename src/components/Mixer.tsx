import { useRef, useEffect } from "react";
import { Destination, Reverb, FeedbackDelay } from "tone";
import useChannelStrip from "../hooks/useChannelStrip";
import useBusFx from "../hooks/useBusFx";
import Transport from "./Transport";
import BusPanels from "./BusChannel/Panels";
import Loader from "./Loader";
import SongInfo from "./SongInfo";
import TrackChannel from "./TrackChannel";
import Main from "./Main";
import BusChannel from "./BusChannel";
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

  const isLoading = MixerMachineContext.useSelector(
    (state) => state.value === "loading"
  );
  const tracks = song.tracks;
  const { channels } = useChannelStrip({ tracks });

  const busFx = useRef({
    reverb1: new Reverb().toDestination(),
    delay1: new FeedbackDelay().toDestination(),
    reverb2: new Reverb().toDestination(),
    delay2: new FeedbackDelay().toDestination(),
  });
  const [busChannels, currentBusFx, disabled] = useBusFx({ busFx });

  useEffect(() => {
    const volume = currentMix.mainVolume;
    const scaled = scale(volume);
    const transposed = dBToPercent(scaled);
    Destination.volume.value = transposed;

    currentTracks?.forEach(
      (currentTrack: TrackSettings, trackIndex: number) => {
        const value = currentTrack.volume;
        const transposed = dBToPercent(scale(value));

        if (channels[trackIndex]) {
          channels[trackIndex].set({ pan: currentTrack.pan });
          channels[trackIndex].set({ volume: transposed });
        }

        currentTrack.activeBusses?.forEach((activeBus) => {
          const currentBusFx = Object.keys(busFx.current);
          if (activeBus === true) {
            currentBusFx.forEach((_, i) => {
              if (channels[trackIndex]) {
                if (i === 0) {
                  channels[trackIndex].send("reverb1");
                  channels[trackIndex].send("delay1");
                } else {
                  channels[trackIndex].send("reverb2");
                  channels[trackIndex].send("delay2");
                }
                channels[trackIndex].connect(
                  busFx.current[
                    `${currentBusFx[i]}` as keyof typeof busFx.current
                  ]
                );
              }
            });
          }
        });
      }
    );
  }, [channels, currentMix.mainVolume, currentTracks]);

  return isLoading ? (
    <Loader song={song} />
  ) : (
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
};

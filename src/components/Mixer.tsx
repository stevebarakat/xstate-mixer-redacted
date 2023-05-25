import { useRef } from "react";
import { Reverb, FeedbackDelay } from "tone";
import useChannelStrip from "../hooks/useChannelStrip";
import useBusFx from "../hooks/useBusFx";
import Transport from "./Transport";
import BusPanels from "./Bus/BusPanels";
import Loader from "./Loader";
import SongInfo from "./SongInfo";
import ChannelStrip from "./ChannelStrip";
import Main from "./Main";
import BusChannel from "./Bus/BusChannel";
import { MixerMachineContext } from "../App";
import type { Song } from "../types/global";

type Props = {
  song: Song;
};

export const Mixer = ({ song }: Props) => {
  const isLoading = MixerMachineContext.useSelector(
    (state) => state.value === "loading"
  );
  const tracks = song.tracks;
  const [channels] = useChannelStrip({ tracks });

  const busFx = useRef({
    reverb1: new Reverb().toDestination(),
    delay1: new FeedbackDelay().toDestination(),
    reverb2: new Reverb().toDestination(),
    delay2: new FeedbackDelay().toDestination(),
  });

  const [busChannels, currentBusFx, disabled] = useBusFx({ busFx });

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
            <ChannelStrip
              key={track.path}
              track={track}
              trackIndex={i}
              channels={channels.current}
            />
          ))}
        </div>
        {busChannels.current.map((_: void, i: number) => (
          <BusChannel
            key={i}
            busChannels={busChannels}
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

import { useEffect, useRef } from "react";
import { Channel, Player, Transport as t, Destination } from "tone";

type Props = {
  tracks: SourceTrack[];
};

function useChannelStrip({ tracks }: Props) {
  const channels = useRef<Channel[] | []>([]);
  const players = useRef<Player[] | []>([]);

  useEffect(() => {
    for (let i = 0; i < tracks.length; i++) {
      channels.current = channels.current && [
        ...channels.current,
        new Channel({ volume: 0 }),
      ];
      players.current = players.current && [
        ...players.current,
        new Player(tracks[i].path),
      ];
    }

    players.current?.forEach((player, i) => {
      channels.current &&
        player.chain(channels.current[i], Destination).sync().start("+0.5");
    });

    return () => {
      t.stop();
      players.current?.forEach((player, i) => {
        player.dispose();
        channels.current && channels.current[i].dispose();
      });
      players.current = [];
      channels.current = [];
    };
  }, [tracks]);

  return { channels: channels.current };
}

export default useChannelStrip;

import { Song } from "../types/global";

type Props = {
  song: Song;
};

function SongInfo({ song }: Props) {
  return (
    <div>
      {song.artist} - {song.title}
    </div>
  );
}

export default SongInfo;

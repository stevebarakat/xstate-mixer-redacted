import Clock from "./Clock";
import Reset from "./Reset";
import Rewind from "./Rewind";
import { FastForward as FF } from "./FastForward";
import Play from "./Play";
import type { Song } from "../../types/global";

type Props = {
  song: Song;
};

const Transport = ({ song }: Props) => (
  <div className="flex gap12">
    <div className="flex gap4">
      <Reset />
      <Rewind />
      <Play />
      <FF />
    </div>
    <Clock song={song} />
  </div>
);

export default Transport;

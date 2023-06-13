import { useState } from "react";
import { localStorageGet, localStorageSet } from "../../utils";

type Props = {
  trackIndex: number;
  channel: Channel;
};

function Pan({ trackIndex, channel }: Props) {
  const currentTracks = localStorageGet("currentTracks");

  const [pan, setPan] = useState(() => currentTracks[trackIndex].pan);

  return (
    <>
      <input
        type="range"
        id={`trackPan${trackIndex}`}
        className="range-x"
        min={-1}
        max={1}
        step={0.01}
        value={pan}
        onChange={(e: React.FormEvent<HTMLInputElement>): void => {
          const value = parseFloat(e.currentTarget.value);
          setPan(value);
          channel.pan.value = value;
          const currentTracks = localStorageGet("currentTracks");
          currentTracks[trackIndex].pan = value;
          localStorageSet("currentTracks", currentTracks);
        }}
      />
    </>
  );
}

export default Pan;

import type { Dispatch, SetStateAction } from "react";
import { TrackPanel } from ".";

type Fx = {
  1: JSX.Element;
  2: JSX.Element;
};

type Props = {
  fx: React.MutableRefObject<Fx>;
  trackIndex: number;
  active: boolean[];
  setActive: Dispatch<SetStateAction<boolean[]>>;
};
function TrackPanels({ fx, trackIndex, active, setActive }: Props) {
  const currentTracksString = localStorage.getItem("currentTracks");
  const currentTracks = currentTracksString && JSON.parse(currentTracksString);
  const ct = currentTracks[trackIndex];

  const trackPanelsEmpty = ct.fxName.every((name: string) => name === "nofx");

  function getTrackPanels() {
    if (trackPanelsEmpty) {
      return null;
    } else {
      return (
        <TrackPanel
          trackIndex={trackIndex}
          active={active}
          setActive={setActive}
        >
          {fx.current["1"]}
          {fx.current["2"]}
        </TrackPanel>
      );
    }
  }
  return getTrackPanels();
}

export default TrackPanels;

import { ReactNode, useState } from "react";
import CloseButton from "../Buttons/CloseButton";
import { Rnd as TrackFxPanel } from "react-rnd";

type Props = {
  children: ReactNode;
  trackIndex: number;
  active: boolean[];
  setActive: React.Dispatch<React.SetStateAction<boolean[]>>;
};

function TrackPanel({ children, trackIndex, active, setActive }: Props) {
  const currentTracksString = localStorage.getItem("currentTracks");
  const currentTracks = currentTracksString && JSON.parse(currentTracksString);

  const positions = currentTracks.map(
    (currentTrack: TrackSettings) => currentTrack.trackPanelPosition
  );
  const [position, setPosition] = useState(
    positions ?? [
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 0 },
      { x: 0, y: 0 },
    ]
  );

  const sizes = currentTracks.map(
    (currentTrack: TrackSettings) => currentTrack.trackPanelSize
  );
  const [size, setSize] = useState(
    sizes ?? [
      { width: "325px", height: "auto" },
      { width: "325px", height: "auto" },
      { width: "325px", height: "auto" },
      { width: "325px", height: "auto" },
    ]
  );

  return (
    <TrackFxPanel
      className="fx-panel"
      position={position[trackIndex]}
      onDragStop={(_, d) => {
        const currentTracksString = localStorage.getItem("currentTracks");
        const currentTracks =
          currentTracksString && JSON.parse(currentTracksString);

        position[trackIndex] = { x: d.x, y: d.y };
        setPosition([...position]);

        currentTracks[trackIndex].trackPanelPosition = { x: d.x, y: d.y };
        localStorage.setItem(
          "currentTracks",
          JSON.stringify([...currentTracks])
        );
      }}
      size={size[trackIndex]}
      minWidth="200px"
      onResizeStop={(_, __, ref) => {
        const currentTracksString = localStorage.getItem("currentTracks");
        const currentTracks =
          currentTracksString && JSON.parse(currentTracksString);

        size[trackIndex] = {
          width: ref.style.width,
          height: "auto",
        };
        setSize([...size]);

        currentTracks[trackIndex].trackPanelSize = {
          width: ref.style.width,
          height: "auto",
        };
        localStorage.setItem(
          "currentTracks",
          JSON.stringify([...currentTracks])
        );
      }}
      cancel="input"
    >
      <CloseButton
        onClick={() => {
          active[trackIndex] = !active[trackIndex];
          setActive([...active]);
        }}
      >
        X
      </CloseButton>
      {children}
    </TrackFxPanel>
  );
}

export default TrackPanel;

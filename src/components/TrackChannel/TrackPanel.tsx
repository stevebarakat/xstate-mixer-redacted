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
  const [position, setPosition] = useState([
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
    { x: 0, y: 0 },
  ]);
  const [size, setSize] = useState([
    { width: "325px", height: "auto" },
    { width: "325px", height: "auto" },
    { width: "325px", height: "auto" },
    { width: "325px", height: "auto" },
  ]);

  return (
    <TrackFxPanel
      className="fx-panel"
      position={position[trackIndex]}
      onDragStop={(_, d) => {
        position[trackIndex] = { x: d.x, y: d.y };
        setPosition([...position]);
      }}
      size={size[trackIndex]}
      minWidth="200px"
      onResizeStop={(_, __, ref) => {
        size[trackIndex] = {
          width: ref.style.width,
          height: ref.style.height,
        };
        setSize([...size]);
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

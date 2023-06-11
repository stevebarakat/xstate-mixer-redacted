import ChannelButton from "../Buttons/ChannelButton";

type Props = {
  trackIndex: number;
  active: boolean[];
  setActive: (arg: boolean[]) => void;
  busChannels: BusChannel[];
  saveTrackFx: React.ChangeEventHandler<HTMLSelectElement>;
};

function FxSelect({
  trackIndex,
  active,
  setActive,
  busChannels,
  saveTrackFx,
}: Props) {
  const currentTracksString = localStorage.getItem("currentTracks");
  const currentTracks = currentTracksString && JSON.parse(currentTracksString);
  const disabled = currentTracks[trackIndex].fxName.every(
    (item: string) => item === "nofx"
  );
  return (
    <>
      <ChannelButton
        className="fx-select"
        disabled={disabled}
        onClick={() => {
          active[trackIndex] = !active[trackIndex];
          setActive([...active]);
        }}
      >
        {disabled ? "No" : active[trackIndex] ? "Close" : "Open"}
        FX
      </ChannelButton>
      {busChannels.map((_, fxIndex) => (
        <select
          key={fxIndex}
          id={`track${trackIndex}fx${fxIndex}`}
          className="fx-select"
          onChange={saveTrackFx}
          value={currentTracks[trackIndex]?.fxName[fxIndex]}
        >
          <option value={"nofx"}>{`FX ${fxIndex + 1}`}</option>
          <option value={"reverb"}>Reverb</option>
          <option value={"delay"}>Delay</option>
          <option value={"pitchShift"}>Pitch Shift</option>
        </select>
      ))}
    </>
  );
}

export default FxSelect;

type Props = {
  trackName: string;
};

function TrackLabel({ trackName }: Props) {
  return <div className="track-label">{trackName}</div>;
}

export default TrackLabel;

type Props = {
  channelName: string;
};

export default function ChannelLabel({ channelName }: Props) {
  return <div className="track-label">{channelName}</div>;
}

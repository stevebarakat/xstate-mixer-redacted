import { useRef, useState } from "react";
import { Reverb, FeedbackDelay, PitchShift, Gain } from "tone";
import TrackPanels from "./TrackPanels";
import { Reverber, Delay, PitchShifter, NoFx } from "./Fx";
import ChannelButton from "../Buttons/ChannelButton";
import Pan from "./Pan";
import SoloMute from "./SoloMute";
import Sends from "./Sends";
import Fader from "./Fader";
import ChannelLabel from "../ChannelLabel";
import type { Channel } from "tone";
import { array } from "../../utils";

type Props = {
  track: SourceTrack;
  trackIndex: number;
  channels: Channel[];
  busChannels: Gain[];
};

type Fx = {
  1: JSX.Element;
  2: JSX.Element;
};

type FxTypes = FeedbackDelay | Reverb | PitchShift | Gain;

function TrackChannel({ track, trackIndex, channels, busChannels }: Props) {
  const currentTracksString = localStorage.getItem("currentTracks");
  const currentTracks = currentTracksString && JSON.parse(currentTracksString);
  const ct = currentTracks[trackIndex];
  const channel = channels[trackIndex];

  const nofx = useRef<Gain | null>(new Gain().toDestination());
  const reverb = useRef<Reverb | null>(null);
  const delay = useRef<FeedbackDelay | null>(null);
  const pitchShift = useRef<PitchShift | null>(null);
  const fxComponents = useRef({
    1: <NoFx nofx={nofx.current} />,
    2: <NoFx nofx={nofx.current} />,
  });

  const fx = (() => {
    const currentFx = ct.fxName ?? null;

    array(2).map((_, fxIndex) => {
      switch (currentFx[fxIndex]) {
        case "nofx":
          if (fxIndex === 0) {
            nofx.current = new Gain().toDestination();

            fxComponents.current = {
              ...fxComponents.current,
              1: <NoFx nofx={nofx.current} />,
            };
          } else {
            nofx.current = new Gain().toDestination();

            fxComponents.current = {
              ...fxComponents.current,
              2: <NoFx nofx={nofx.current} />,
            };
          }
          break;
        case "reverb":
          if (fxIndex === 0) {
            reverb.current = new Reverb({
              wet: ct.reverbsMix[0],
              preDelay: ct.reverbsPreDelay[0],
              decay: ct.reverbsDecay[0],
            }).toDestination();

            fxComponents.current = {
              ...fxComponents.current,
              1: (
                <Reverber
                  reverb={reverb.current}
                  trackIndex={trackIndex}
                  busIndex={0}
                />
              ),
            };
          } else {
            reverb.current = new Reverb({
              wet: ct.reverbsMix[1],
              preDelay: ct.reverbsPreDelay[1],
              decay: ct.reverbsDecay[1],
            }).toDestination();

            fxComponents.current = {
              ...fxComponents.current,
              2: (
                <Reverber
                  reverb={reverb.current}
                  trackIndex={trackIndex}
                  busIndex={1}
                />
              ),
            };
          }

          break;
        case "delay":
          if (fxIndex === 0) {
            delay.current = new FeedbackDelay({
              wet: ct.delaysMix[0],
              delayTime: ct.delaysTime[0],
              feedback: ct.delaysFeedback[0],
            }).toDestination();

            fxComponents.current = {
              ...fxComponents.current,
              1: (
                <Delay
                  delay={delay.current}
                  trackIndex={trackIndex}
                  busIndex={0}
                />
              ),
            };
          } else {
            delay.current = new FeedbackDelay({
              wet: ct.delaysMix[1],
              delayTime: ct.delaysTime[1],
              feedback: ct.delaysFeedback[1],
            }).toDestination();

            fxComponents.current = {
              ...fxComponents.current,
              2: (
                <Delay
                  delay={delay.current}
                  trackIndex={trackIndex}
                  busIndex={1}
                />
              ),
            };
          }
          break;
        case "pitchShift":
          if (fxIndex === 0) {
            pitchShift.current = new PitchShift({
              wet: ct.pitchShiftsMix[0],
              pitch: ct.pitchShiftsPitch[0],
            }).toDestination();

            fxComponents.current = {
              ...fxComponents.current,
              1: (
                <PitchShifter
                  pitchShift={pitchShift.current}
                  trackIndex={trackIndex}
                  busIndex={0}
                />
              ),
            };
          } else {
            pitchShift.current = new PitchShift({
              wet: ct.pitchShiftsMix[1],
              pitch: ct.pitchShiftsPitch[1],
            }).toDestination();

            fxComponents.current = {
              ...fxComponents.current,
              2: (
                <PitchShifter
                  pitchShift={pitchShift.current}
                  trackIndex={trackIndex}
                  busIndex={1}
                />
              ),
            };
          }

          break;
        default:
          break;
      }
    });
    const fxProps = Object.values(fxComponents.current).map((fx) => fx.props);
    const fxNodes = fxProps.map((prop, i) => Object.values(prop)[0]);
    console.log("fxNodes", fxNodes);
    channel.disconnect();
    fxNodes.forEach((node: FxTypes) => {
      channel.chain(node);
    });
    return fxComponents.current;
  })();

  const [trackFx, setTrackFx] = useState(() => {
    return (
      currentTracks.fxName ?? Array(currentTracks.length).fill(["nofx", "nofx"])
    );
  });

  const [active, setActive] = useState([true, true, true, true]);

  function saveTrackFx(e: React.FormEvent<HTMLSelectElement>) {
    const currentTracksString = localStorage.getItem("currentTracks");
    const currentTracks =
      currentTracksString && JSON.parse(currentTracksString);

    const sid = e.currentTarget.id.at(-1) ?? 0;
    const id = parseInt(sid.toString(), 10);
    trackFx[trackIndex][id] = e.currentTarget.value;
    setTrackFx([...trackFx]);

    currentTracks[trackIndex].fxName[id] = e.currentTarget.value;
    localStorage.setItem("currentTracks", JSON.stringify([...currentTracks]));

    switch (e.currentTarget.value) {
      case "nofx":
        fx[`${id + 1}` as unknown as keyof Fx] = <NoFx nofx={nofx.current} />;
        break;

      case "reverb":
        fx[`${id + 1}` as unknown as keyof Fx] = (
          <Reverber
            reverb={reverb.current}
            trackIndex={trackIndex}
            busIndex={id}
          />
        );
        break;

      case "delay":
        fx[`${id + 1}` as unknown as keyof Fx] = (
          <Delay delay={delay.current} trackIndex={trackIndex} busIndex={id} />
        );
        break;

      case "pitchShift":
        fx[`${id + 1}` as unknown as keyof Fx] = (
          <PitchShifter
            pitchShift={pitchShift.current}
            trackIndex={trackIndex}
            busIndex={id}
          />
        );
        break;

      default:
        break;
    }

    const fxProps = Object.values(fx).map((fx) => fx.props);
    const fxNodes = fxProps.map((prop) => Object.values(prop)[0]);
    fxNodes.map((node: FxTypes) => {
      console.log("node", node);
      if (!node) return;
      channel?.disconnect();
      return channel?.connect(node);
    });
  }

  const disabled = currentTracks[trackIndex].fxName.every(
    (item: string) => item === "nofx"
  );

  const trackPanelsEmpty = ct.fxName.every((name: string) => name === "nofx");

  function getTrackPanels() {
    // if (trackPanelsEmpty) {
    //   return null;
    // } else {
    return (
      <TrackPanels
        fx={fx}
        trackIndex={trackIndex}
        active={active}
        setActive={setActive}
      />
    );
    // }
  }

  return (
    <div className="flex-y gap2">
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
      {array(2).map((_, fxIndex) => (
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
      <>
        <TrackPanels
          fx={fx}
          trackIndex={trackIndex}
          active={active}
          setActive={setActive}
        />
      </>
      <div className="channel">
        <Sends
          trackIndex={trackIndex}
          channels={channels}
          busChannels={busChannels}
        />
        <Pan trackIndex={trackIndex} channel={channel} />
        <Fader trackIndex={trackIndex} channel={channel} />
        <SoloMute trackIndex={trackIndex} channel={channel} />
        <ChannelLabel channelName={track.name} />
      </div>
    </div>
  );
}

export default TrackChannel;

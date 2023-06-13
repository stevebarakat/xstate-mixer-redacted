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

  const gain = useRef<Gain>(new Gain().toDestination());
  const reverb = useRef<Reverb | null>(null);
  const delay = useRef<FeedbackDelay | null>(null);
  const pitchShift = useRef<PitchShift | null>(null);

  const fx = useRef<Fx>(
    (() => {
      const currentFx = currentTracks[trackIndex]?.fxName ?? null;
      console.log("currentFx", currentFx);

      let fxComponents = {
        1: <NoFx gain={gain.current} />,
        2: <NoFx gain={gain.current} />,
      };
      array(2).map((_, fxIndex) => {
        switch (currentFx[fxIndex]) {
          case "nofx":
            fxIndex === 0
              ? (fxComponents = {
                  ...fxComponents,
                  1: <NoFx gain={gain.current} />,
                })
              : (fxComponents = {
                  ...fxComponents,
                  2: <NoFx gain={gain.current} />,
                });
            break;
          case "reverb":
            if (fxIndex === 0) {
              reverb.current = new Reverb({
                wet: ct.reverbsMix[0],
                preDelay: ct.reverbsPreDelay[0],
                decay: ct.reverbsDecay[0],
              }).toDestination();

              fxComponents = {
                ...fxComponents,
                1: <Reverber reverb={reverb.current} trackIndex={trackIndex} />,
              };
            } else {
              reverb.current = new Reverb({
                wet: ct.reverbsMix[1],
                preDelay: ct.reverbsPreDelay[1],
                decay: ct.reverbsDecay[1],
              }).toDestination();

              fxComponents = {
                ...fxComponents,
                2: <Reverber reverb={reverb.current} trackIndex={trackIndex} />,
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

              fxComponents = {
                ...fxComponents,
                1: <Delay delay={delay.current} trackIndex={trackIndex} />,
              };
            } else {
              delay.current = new FeedbackDelay({
                wet: ct.delaysMix[1],
                delayTime: ct.delaysTime[1],
                feedback: ct.delaysFeedback[1],
              }).toDestination();

              fxComponents = {
                ...fxComponents,
                2: <Delay delay={delay.current} trackIndex={trackIndex} />,
              };
            }
            break;
          case "pitchShift":
            if (fxIndex === 0) {
              pitchShift.current = new PitchShift({
                wet: ct.pitchShiftsMix[0],
                pitch: ct.pitchShiftsPitch[0],
              }).toDestination();

              fxComponents = {
                ...fxComponents,
                1: (
                  <PitchShifter
                    pitchShift={pitchShift.current}
                    trackIndex={trackIndex}
                  />
                ),
              };
            } else {
              pitchShift.current = new PitchShift({
                wet: ct.pitchShiftsMix[1],
                pitch: ct.pitchShiftsPitch[1],
              }).toDestination();

              fxComponents = {
                ...fxComponents,
                2: (
                  <PitchShifter
                    pitchShift={pitchShift.current}
                    trackIndex={trackIndex}
                  />
                ),
              };
            }

            break;
          default:
            break;
        }
      });
      const fxProps = Object.values(fxComponents).map((fx) => fx.props);
      const fxNodes = fxProps.map((prop) => Object.values(prop)[0]);
      channel.disconnect();
      fxNodes.forEach((node: FxTypes) => {
        channel.chain(node);
      });
      return fxComponents;
    })()
  );

  console.log("fx.current", fx.current);

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

    console.log("id", id);
    switch (e.currentTarget.value) {
      case "nofx":
        fx.current[`${id + 1}` as unknown as keyof Fx] = (
          <NoFx gain={gain.current} />
        );
        break;

      case "reverb":
        fx.current[`${id + 1}` as unknown as keyof Fx] = (
          <Reverber reverb={reverb.current} trackIndex={trackIndex} />
        );
        break;

      case "delay":
        fx.current[`${id + 1}` as unknown as keyof Fx] = (
          <Delay delay={delay.current} trackIndex={trackIndex} />
        );
        break;

      case "pitchShift":
        fx.current[`${id + 1}` as unknown as keyof Fx] = (
          <PitchShifter
            pitchShift={pitchShift.current}
            trackIndex={trackIndex}
          />
        );
        break;

      default:
        break;
    }

    const fxProps = Object.values(fx.current).map((fx) => fx.props);
    const fxNodes = fxProps.map((prop) => Object.values(prop)[0]);
    channel.disconnect();
    fxNodes.forEach((node: FxTypes) => {
      channel.chain(node);
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

import { MixerMachineContext } from "../App";
import { dBToPercent, scale } from "../../utils/scale";
import VuMeter from "./VuMeter";
import useVuMeter from "./../hooks/useVuMeter";
import { Destination } from "tone";

function Main() {
  const [state, send] = MixerMachineContext.useActor();
  const meterVal = useVuMeter([Destination]);

  function changeMainVolume(e: React.FormEvent<HTMLInputElement>): void {
    send({
      type: "CHANGE_MAIN_VOLUME",
      value: parseFloat(e.currentTarget.value),
    });
  }

  return (
    <div className="channel">
      <div className="flex-y center fader-wrap">
        <div className="window">
          {`${state.context.mainVolume.toFixed(0)} dB`}
        </div>
        <div className="levels-wrap">
          <VuMeter meterValue={meterVal} height={250} width={20} />
        </div>
        <div className="vol-wrap">
          <input
            type="range"
            className="range-y volume main"
            id="main"
            min={-100}
            max={12}
            step={0.1}
            value={state.context.mainVolume}
            onChange={changeMainVolume}
          />
        </div>
        <label htmlFor="main">Main</label>
      </div>
    </div>
  );
}

export default Main;

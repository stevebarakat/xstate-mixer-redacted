import { FeedbackDelay, Reverb } from "tone";
import BusPanel1 from "./BusPanel1";
import BusPanel2 from "./BusPanel2";

type Props = {
  busFx: React.MutableRefObject<{
    reverb1: Reverb;
    reverb2: Reverb;
    delay1: FeedbackDelay;
    delay2: FeedbackDelay;
  }>;
  currentBusFx: {
    reverb1: Reverb;
    reverb2: Reverb;
    delay1: FeedbackDelay;
    delay2: FeedbackDelay;
  };
  disabled: { panel1: boolean; panel2: boolean };
};

function BusPanels({ busFx, currentBusFx, disabled }: Props) {
  return (
    <>
      <BusPanel1 disabled={disabled} fx={busFx} currentBusFx={currentBusFx} />
      <BusPanel2 disabled={disabled} fx={busFx} currentBusFx={currentBusFx} />
    </>
  );
}

export default BusPanels;

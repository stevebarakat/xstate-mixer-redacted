import type { Gain as TGain, Channel as TChannel } from "tone";

declare global {
  type Channel = TChannel;
  type Gain = TGain;
  type BusChannel = Gain | null;

  type SourceSong = {
    id: string;
    slug: string;
    title: string;
    artist: string;
    year: string;
    studio: string;
    location: string;
    bpm: number;
    start: number;
    end: number;
    tracks: SourceTrack[];
  };

  type SourceTrack = {
    id: string;
    name: string;
    path: string;
  };

  type MixSettings = {
    id: string;
    songSlug: string;
    masterVolume: number;
    bussesVolume: number;
    busFxChoices: string[][];
    trackFxChoices: [];
    delaysMix: number;
    delaysTime: number;
    delaysFeedback: number;
    reverbsMix: number;
    reverbsPreDelay: number;
    reverbsDecay: number;
    pitchShiftsMix: number;
    pitchShiftsPitch: number;
    pitchShiftsDelayTime: number;
    pitchShiftsSize: number;
    pitchShiftsFeedback: number;
    chebyshevsMix: number;
    chebyshevsOrder: number;
    freqShiftsMix: number;
    freqShiftsFreq: number;
    compressorsThreshold: number;
    compressorsRatio: number;
    compressorsKnee: number;
    compressorsAttack: number;
    compressorsRelease: number;
    trackSettings: TrackSettings;
  };

  type TrackSettings = {
    id: string;
    volume: number;
    solo: boolean;
    mute: boolean;
    pan: number;
    sends: boolean[];
    fxName: string[];
    eqHi: number;
    eqMid: number;
    eqLow: number;
    delaysMix: number;
    delaysTime: number;
    delaysFeedback: number;
    reverbsMix: number;
    reverbsPreDelay: number;
    reverbsDecay: number;
    pitchShiftsMix: number;
    pitchShiftsPitch: number;
    pitchShiftsDelayTime: number;
    pitchShiftsSize: number;
    pitchShiftsFeedback: number;
    chebyshevsMix: number;
    chebyshevsOrder: number;
    freqShiftsMix: number;
    freqShiftsFreq: number;
    compressorsThreshold: number;
    compressorsRatio: number;
    compressorsKnee: number;
    compressorsAttack: number;
    compressorsRelease: number;
    reverbsBypass: boolean;
    delaysBypass: boolean;
    pitchShiftsBypass: boolean;
    trackPanelPosition: { x: number; y: number };
    trackPanelSize: { width: string; height: string };
  };
}

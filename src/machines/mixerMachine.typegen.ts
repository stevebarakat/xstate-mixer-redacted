// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {};
  missingImplementations: {
    actions: never;
    delays: never;
    guards: never;
    services: never;
  };
  eventsCausingActions: {
    bypassBusDelay: "BYPASS_BUS_DELAY";
    bypassBusReverb: "BYPASS_BUS_REVERB";
    bypassTrackDelay: "BYPASS_TRACK_DELAY";
    bypassTrackPitchShift: "BYPASS_TRACK_PITCHSHIFT";
    bypassTrackReverb: "BYPASS_TRACK_REVERB";
    changeBusDelayFeedback: "CHANGE_BUS_DELAY_FEEDBACK";
    changeBusDelayMix: "CHANGE_BUS_DELAY_MIX";
    changeBusDelayTime: "CHANGE_BUS_DELAY_TIME";
    changeBusReverbDecay: "CHANGE_BUS_REVERB_DECAY";
    changeBusReverbMix: "CHANGE_BUS_REVERB_MIX";
    changeBusReverbPredelay: "CHANGE_BUS_REVERB_PREDELAY";
    changeBusVolume: "CHANGE_BUS_VOLUME";
    changeMainVolume: "CHANGE_MAIN_VOLUME";
    changePan: "CHANGE_PAN";
    changeTrackDelayFeedback: "CHANGE_TRACK_DELAY_FEEDBACK";
    changeTrackDelayMix: "CHANGE_TRACK_DELAY_MIX";
    changeTrackDelayTime: "CHANGE_TRACK_DELAY_TIME";
    changeTrackPitchShiftMix: "CHANGE_TRACK_PITCHSHIFT_MIX";
    changeTrackPitchShiftPitch: "CHANGE_TRACK_PITCHSHIFT_PITCH";
    changeTrackReverbDecay: "CHANGE_TRACK_REVERB_DECAY";
    changeTrackReverbMix: "CHANGE_TRACK_REVERB_MIX";
    changeTrackReverbPredelay: "CHANGE_TRACK_REVERB_PREDELAY";
    changeTrackVolume: "CHANGE_TRACK_VOLUME";
    fastForward: "FF";
    pause: "PAUSE";
    play: "PLAY";
    reset: "RESET";
    rewind: "REWIND";
    saveBusPanelsPosition: "SAVE_BUS_PANELS_POSITION";
    saveBusPanelsSize: "SAVE_BUS_PANELS_SIZE";
    saveTrackPanelPosition: "SAVE_TRACK_PANEL_POSITION";
    saveTrackPanelSize: "SAVE_TRACK_PANEL_SIZE";
    setBusFx: "SET_BUS_FX";
    setTrackFx: "SET_TRACK_FX";
    toggleBusPanel: "TOGGLE_BUS_PANEL";
    toggleMute: "TOGGLE_MUTE";
    toggleSolo: "TOGGLE_SOLO";
    toggleTrackPanel: "TOGGLE_TRACK_PANEL";
  };
  eventsCausingDelays: {};
  eventsCausingGuards: {};
  eventsCausingServices: {};
  matchesStates:
    | "loading"
    | "playing"
    | "playing.active"
    | "playing.inactive"
    | "stopped"
    | "stopped.active"
    | "stopped.inactive"
    | { playing?: "active" | "inactive"; stopped?: "active" | "inactive" };
  tags: never;
}

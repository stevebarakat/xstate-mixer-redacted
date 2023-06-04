// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {};
  missingImplementations: {
    actions: "setTrackFx" | "toggleTrackPanel";
    delays: never;
    guards: never;
    services: never;
  };
  eventsCausingActions: {
    changeBusVolume: "CHANGE_BUS_VOLUME";
    changeMainVolume: "CHANGE_MAIN_VOLUME";
    changePan: "CHANGE_PAN";
    changeTrackVolume: "CHANGE_TRACK_VOLUME";
    fastForward: "FF";
    pause: "PAUSE";
    play: "PLAY";
    reset: "RESET";
    rewind: "REWIND";
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

import { createMachine, assign } from "xstate";
import { pure } from "xstate/lib/actions";
import {
  start as initializeAudio,
  getContext as getAudioContext,
  Destination,
  Transport as t,
} from "tone";
import { dBToPercent, scale } from "../utils/scale";
import { getSong } from "../utils/getSong";
import { roxanne } from "../songs";
import type { TrackSettings } from "../types/global";

const actx = getAudioContext();
const [song, currentMix, currentTracks] = getSong(roxanne);
const initialVolumes = currentTracks.map(
  (currentTrack: TrackSettings) => currentTrack.volume
);
const initialBusVolumes = currentMix.busVolumes.map((volume: number) => volume);
const initialPans = currentTracks.map(
  (currentTrack: TrackSettings) => currentTrack.pan
);
const initialMutes = currentTracks.map(
  (currentTrack: TrackSettings) => currentTrack.mute
);
const initialSolos = currentTracks.map(
  (currentTrack: TrackSettings) => currentTrack.solo
);
const initialTrackFx = currentTracks.map(
  (currentTrack: TrackSettings) => currentTrack.currentTrackFx
);

const initialTrackPanelActive = currentTracks.map(
  (currentTrack: TrackSettings) => currentTrack.trackPanelActive
);

const initialTrackPanelPosition = currentTracks.map(
  (currentTrack: TrackSettings) => currentTrack.trackPanelPosition
);

const initialTrackPanelSize = currentTracks.map(
  (currentTrack: TrackSettings) => currentTrack.trackPanelSize
);

const initialReverbsBypass = currentTracks.map(
  (currentTrack: TrackSettings) => currentTrack.reverbsBypass
);

const initialReverbsMix = currentTracks.map(
  (currentTrack: TrackSettings) => currentTrack.reverbsMix
);

const initialRevebsPreDelay = currentTracks.map(
  (currentTrack: TrackSettings) => currentTrack.reverbsPreDelay
);

const initialReverbsDecay = currentTracks.map(
  (currentTrack: TrackSettings) => currentTrack.reverbsDecay
);

const initialDelaysBypass = currentTracks.map(
  (currentTrack: TrackSettings) => currentTrack.delaysBypass
);

const initialDelaysMix = currentTracks.map(
  (currentTrack: TrackSettings) => currentTrack.delaysMix
);

const initialDelaysTime = currentTracks.map(
  (currentTrack: TrackSettings) => currentTrack.delaysTime
);

const initialDelaysFeedback = currentTracks.map(
  (currentTrack: TrackSettings) => currentTrack.delaysFeedback
);

const initialPitchShiftsBypass = currentTracks.map(
  (currentTrack: TrackSettings) => currentTrack.pitchShiftsBypass
);

const initialPitchShiftsMix = currentTracks.map(
  (currentTrack: TrackSettings) => currentTrack.pitchShiftsMix
);

const initialPitchShiftsPitch = currentTracks.map(
  (currentTrack: TrackSettings) => currentTrack.pitchShiftsPitch
);

export const mixerMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QFsCWAPMAnAxAJQFEBlAgFQG0AGAXUVAAcB7WVAF1UYDs6R1EA2AIwAWAHQBOYeIBMggBwB2AKwAaEAE9EAWgViAzIP7DK-aUoC+5tWky5CAdQCSAOQAiVWkhBMW7Ljz4EYSUlUTlxOWE9ZTVNBC1ouVFBM0trDGwcADEsjx4fNg5uL0DpPWlRJUo9cRMzWO1E5NSrEBtMgGEACQBBZwBxAgB9ADUAeQAZAFUAWQI8rwK-YtBA8P5k-gVxfkVVDW1BJUFRKX5KcWiLVvbcbr7BoZmel1HJ2fmafOZC-xLEORKMSUQSCBTyGIHeJ6c6iMw1OrXdK2HD3AbDABCUyIb2mcwWDB+ywC2mEKVOZOMpn2cT05UqCOpaTaGVwJFIQyxOKyAA0Cd4iUUeHEtNJtpVKAo5Cl9mtdpUxXoospmbdUb10UMAAp9flLIX-BBySWnJQGepQvRyDYKJVXVWsnCkMb9foTYZESZjPWCv6rAFKDb8cQyCE07TSSinMxSmUOlHO13up5TUifTyE3wG-1GvShYSRK4NBARSqxlrIzIYgCaOqIOMIIwIeAxPqzfqhovFVXLsoB8qUiuVSJZKLRj0bzYxOJmjj5X0WvpWvEaUtE1OLgnEJ2t4L28c6GonBCbLZxWsIrgIEx61bbv2XgS0xj0FLNMuLwg2NWC5pHavHYZJzPIYrw6W972JQ1n1BN8-2LHR9EMKkK1HKtax6etQOvCCF0zB9hQjbtJWlC05SSQdbWHA87iPYYrxvasZznSDs07MVxAlXs1HIhUqPtG5HUA7DGJxUhHHxPCBXbZcRQ4rjSL7I0ByHATK1oh56JwpihiyAgCFcDEeg6ABpViOzk4juJXZSKNUlVBNsUQABtGAAQwgVBOCgHAJjGHor3cKT9Q7QJjCjaRIv4QMLRFFIkgUYN31Q25RHoZy3PULyfJ1bF02+GSSSCbc4TDBDTAkQQQRi-9WTSjKsu80QvLcgBjdgADcwBwIgeibTlsW1PprxxMYtQIZxzMfRA9EoMRBzNWoNyhMkkjKObdgc9T6sy7LRDazrut6-quSG5wRqGMaJqmorZG-WaSI-KFZB3ShHpSurYFYRh6HoSAcC1RibsNQxOPKYRZD2cqKm3aqmUc7BRC+n6-ogZrOAO1Aup6vrMUGnVzomUbxsm4Kl0IhAlQ2Y0vyhmzEpOapjhqmike+37IH29qsaO3GBvPYaicukngdAOIXrCN7rMCfh+FfSgymo5lOEYCA4B4W4CoI6DQmNWWUPDeJ5J7RTWdcjzsq1qCc2MXW5ekRSEK3CopdNhGsB2xqoCttiwoqLc6SUS5ITiBQoxDSGtrQj30t2pqWu5rqfdCxAA+SLcRERYs6RONTo89vbMaTxdCsNWpkkuPNg8NyN81Dfd3bZlHIGT6agjBMItjKqEUn0V240b5GObRhPDtboqQkZvMjmW2kv0l2mo9SofUa5seS+1m3os7vcQ8QCXjXe65LCAA */
    id: "mixer",
    initial: "loading",
    tsTypes: {} as import("./mixerMachine.typegen").Typegen0,
    context: {
      mainVolume: currentMix.mainVolume,
      busVolumes: initialBusVolumes,
      volume: initialVolumes,
      pan: initialPans,
      solo: initialSolos,
      mute: initialMutes,
      currentTrackFx: initialTrackFx,
      currentBusFx: currentMix.currentBusFx,
      busPanelActive: currentMix.busPanelActive,
      busPanelPosition: currentMix.busPanelPosition,
      busPanelSize: currentMix.busPanelSize,
      busFxData: {
        reverbsBypass: currentMix.busFxData.reverbsBypass,
        reverbsMix: currentMix.busFxData.reverbsMix,
        reverbsPreDelay: currentMix.busFxData.reverbsPreDelay,
        reverbsDecay: currentMix.busFxData.reverbsDecay,
        delaysBypass: currentMix.busFxData.delaysBypass,
        delaysMix: currentMix.busFxData.delaysMix,
        delaysTime: currentMix.busFxData.delaysTime,
        delaysFeedback: currentMix.busFxData.delaysFeedback,
      },
      reverbsBypass: initialReverbsBypass,
      reverbsMix: initialReverbsMix,
      reverbsPreDelay: initialRevebsPreDelay,
      reverbsDecay: initialReverbsDecay,
      delaysBypass: initialDelaysBypass,
      delaysMix: initialDelaysMix,
      delaysTime: initialDelaysTime,
      delaysFeedback: initialDelaysFeedback,
      pitchShiftsBypass: initialPitchShiftsBypass,
      pitchShiftsMix: initialPitchShiftsMix,
      pitchShiftsPitch: initialPitchShiftsPitch,
      trackPanelActive: initialTrackPanelActive,
      trackPanelPosition: initialTrackPanelPosition,
      trackPanelSize: initialTrackPanelSize,
    },
    on: {
      RESET: { actions: "reset", target: "stopped" },
      REWIND: { actions: "rewind" },
      FF: { actions: "fastForward" },
      CHANGE_TRACK_VOLUME: { actions: "changeTrackVolume" },
      CHANGE_MAIN_VOLUME: { actions: "changeMainVolume" },
      CHANGE_BUS_VOLUME: { actions: "changeBusVolume" },
      SET_BUS_FX: { actions: "setBusFx" },
      SET_TRACK_FX: { actions: "setTrackFx" },
      CHANGE_PAN: { actions: "changePan" },
      TOGGLE_SOLO: { actions: "toggleSolo" },
      TOGGLE_MUTE: { actions: "toggleMute" },
      BYPASS_BUS_REVERB: { actions: "bypassBusReverb" },
      BYPASS_TRACK_REVERB: { actions: "bypassTrackReverb" },
      CHANGE_BUS_REVERB_MIX: { actions: "changeBusReverbMix" },
      CHANGE_TRACK_REVERB_MIX: { actions: "changeTrackReverbMix" },
      CHANGE_BUS_REVERB_PREDELAY: { actions: "changeBusReverbPredelay" },
      CHANGE_TRACK_REVERB_PREDELAY: { actions: "changeTrackReverbPredelay" },
      CHANGE_BUS_REVERB_DECAY: { actions: "changeBusReverbDecay" },
      CHANGE_TRACK_REVERB_DECAY: { actions: "changeTrackReverbDecay" },
      CHANGE_TRACK_PITCHSHIFT_PITCH: { actions: "changeTrackPitchShiftPitch" },
      BYPASS_BUS_DELAY: { actions: "bypassBusDelay" },
      BYPASS_TRACK_DELAY: { actions: "bypassTrackDelay" },
      CHANGE_BUS_DELAY_MIX: { actions: "changeBusDelayMix" },
      CHANGE_TRACK_DELAY_MIX: { actions: "changeTrackDelayMix" },
      CHANGE_TRACK_PITCHSHIFT_MIX: { actions: "changeTrackPitchShiftMix" },
      CHANGE_BUS_DELAY_TIME: { actions: "changeBusDelayTime" },
      CHANGE_TRACK_DELAY_TIME: { actions: "changeTrackDelayTime" },
      CHANGE_BUS_DELAY_FEEDBACK: { actions: "changeBusDelayFeedback" },
      CHANGE_TRACK_DELAY_FEEDBACK: { actions: "changeTrackDelayFeedback" },
      BYPASS_TRACK_PITCHSHIFT: { actions: "bypassTrackPitchShift" },
      SAVE_BUS_PANELS_POSITION: { actions: "saveBusPanelsPosition" },
      SAVE_BUS_PANELS_SIZE: { actions: "saveBusPanelsSize" },
      SAVE_TRACK_PANEL_POSITION: { actions: "saveTrackPanelPosition" },
      SAVE_TRACK_PANEL_SIZE: { actions: "saveTrackPanelSize" },
    },
    states: {
      loading: { on: { LOADED: "stopped" } },
      playing: {
        initial: "active",
        entry: "play",
        states: {
          inactive: {
            on: {
              TOGGLE_BUS_PANEL: {
                target: "active",
                actions: "toggleBusPanel",
              },
              TOGGLE_TRACK_PANEL: {
                target: "active",
                actions: "toggleTrackPanel",
              },
            },
          },
          active: {
            on: {
              TOGGLE_BUS_PANEL: {
                target: "inactive",
                actions: "toggleBusPanel",
              },
              TOGGLE_TRACK_PANEL: {
                target: "inactive",
                actions: "toggleTrackPanel",
              },
            },
          },
        },
        on: {
          PAUSE: { target: "stopped", actions: "pause" },
        },
      },
      stopped: {
        initial: "active",
        states: {
          inactive: {
            on: {
              TOGGLE_BUS_PANEL: {
                target: "active",
                actions: "toggleBusPanel",
              },
              TOGGLE_TRACK_PANEL: {
                target: "active",
                actions: "toggleTrackPanel",
              },
            },
          },
          active: {
            on: {
              TOGGLE_BUS_PANEL: {
                target: "inactive",
                actions: "toggleBusPanel",
              },
              TOGGLE_TRACK_PANEL: {
                target: "inactive",
                actions: "toggleTrackPanel",
              },
            },
          },
        },
        on: {
          PLAY: { target: "playing" },
        },
      },
    },
    schema: {
      events: {} as
        | { type: "RESET" }
        | { type: "REWIND" }
        | { type: "FF" }
        | { type: "CHANGE_TRACK_VOLUME" }
        | { type: "CHANGE_MAIN_VOLUME" }
        | { type: "CHANGE_BUS_VOLUME" }
        | { type: "SET_BUS_FX" }
        | { type: "SET_TRACK_FX" }
        | { type: "TOGGLE_BUS_PANEL" }
        | { type: "CHANGE_PAN" }
        | { type: "TOGGLE_SOLO" }
        | { type: "TOGGLE_MUTE" }
        | { type: "BYPASS_BUS_REVERB" }
        | { type: "BYPASS_TRACK_REVERB" }
        | { type: "CHANGE_BUS_REVERB_MIX" }
        | { type: "CHANGE_TRACK_REVERB_MIX" }
        | { type: "CHANGE_TRACK_PITCHSHIFT_MIX" }
        | { type: "CHANGE_BUS_REVERB_PREDELAY" }
        | { type: "CHANGE_TRACK_REVERB_PREDELAY" }
        | { type: "CHANGE_BUS_REVERB_DECAY" }
        | { type: "CHANGE_TRACK_REVERB_DECAY" }
        | { type: "BYPASS_BUS_DELAY" }
        | { type: "BYPASS_TRACK_DELAY" }
        | { type: "BYPASS_TRACK_PITCHSHIFT" }
        | { type: "CHANGE_TRACK_PITCHSHIFT_PITCH" }
        | { type: "CHANGE_BUS_DELAY_MIX" }
        | { type: "CHANGE_BUS_DELAY_TIME" }
        | { type: "CHANGE_TRACK_DELAY_TIME" }
        | { type: "CHANGE_BUS_DELAY_FEEDBACK" }
        | { type: "CHANGE_TRACK_DELAY_FEEDBACK" }
        | { type: "LOADED" }
        | { type: "PAUSE" }
        | { type: "PLAY" }
        | { type: "SAVE_BUS_PANELS_POSITION" }
        | { type: "SAVE_TRACK_PANEL_POSITION" }
        | { type: "SAVE_TRACK_PANEL_SIZE" }
        | { type: "SAVE_BUS_PANELS_SIZE" }
        | { type: "CHANGE_TRACK_DELAY_MIX" }
        | { type: "TOGGLE_TRACK_PANEL" },
    },
    predictableActionArguments: true,
    preserveActionOrder: true,
  },

  {
    actions: {
      play: () => {
        if (actx.state === "suspended") {
          initializeAudio();
          t.start();
        } else {
          t.start();
        }
      },
      pause: () => t.pause(),
      reset: () => {
        t.stop();
        t.seconds = song.start ?? 0;
      },
      fastForward: () =>
        (t.seconds =
          t.seconds < song.end - 10 ? t.seconds + 10 : (t.seconds = song.end)),
      rewind: () =>
        (t.seconds = t.seconds > 10 + song.start ? t.seconds - 10 : song.start),

      changeMainVolume: pure((_, { value }) => {
        const scaled = dBToPercent(scale(value));
        const volume = () => {
          Destination.volume.value = scaled;
        };
        currentMix.mainVolume = value;
        localStorage.setItem("currentMix", JSON.stringify(currentMix));
        return [assign({ mainVolume: value }), volume];
      }),

      changeBusVolume: pure((context, { busIndex, value, channel }) => {
        const scaled = dBToPercent(scale(value));
        const volume = () => {
          channel.volume.value = scaled;
        };
        const tempBusVols = context.busVolumes;
        tempBusVols[busIndex] = value;
        currentMix.busVolumes[busIndex] = value;
        localStorage.setItem("currentMix", JSON.stringify(currentMix));
        return [assign({ busVolumes: tempBusVols }), volume];
      }),

      changeTrackVolume: pure((context, { value, trackIndex, channel }) => {
        const scaled = dBToPercent(scale(parseFloat(value)));
        const channelVolume = () => {
          channel.volume.value = scaled;
        };
        const tempVols = context.volume;
        tempVols[trackIndex] = parseFloat(value);
        currentTracks[trackIndex].volume = value;
        localStorage.setItem(
          "currentTracks",
          JSON.stringify([...currentTracks])
        );
        return [assign({ volume: tempVols }), channelVolume];
      }),

      changePan: pure((context, { value, trackIndex, channel }) => {
        const channelPan = () => {
          channel.pan.value = value;
        };
        const tempPans = context.pan;
        tempPans[trackIndex] = value;
        currentTracks[trackIndex].pan = value;
        localStorage.setItem(
          "currentTracks",
          JSON.stringify([...currentTracks])
        );
        return [assign({ pan: tempPans }), channelPan];
      }),

      toggleMute: pure((context, { trackIndex, checked, channel }) => {
        const muteChannel = () => {
          channel.mute = checked;
        };
        const tempMutes = context.mute;
        tempMutes[trackIndex] = checked;
        currentTracks[trackIndex].mute = checked;
        localStorage.setItem(
          "currentTracks",
          JSON.stringify([...currentTracks])
        );
        return [assign({ mute: tempMutes }), muteChannel];
      }),

      toggleSolo: pure((context, { trackIndex, checked, channel }) => {
        const soloChannel = () => {
          channel.solo = checked;
        };
        const tempSolos = context.solo;
        tempSolos[trackIndex] = checked;
        currentTracks[trackIndex].solo = checked;
        localStorage.setItem(
          "currentTracks",
          JSON.stringify([...currentTracks])
        );
        return [assign({ solo: tempSolos }), soloChannel];
      }),

      setBusFx: assign((context, { value, busIndex, fxIndex }) => {
        context.currentBusFx = {
          ...context.currentBusFx,
          [`bus${busIndex + 1}fx${fxIndex + 1}`]: value,
        };
        localStorage.setItem(
          "currentMix",
          JSON.stringify({
            ...currentMix,
            currentBusFx: {
              ...context.currentBusFx,
              [`bus${busIndex + 1}fx${fxIndex + 1}`]: value,
            },
          })
        );
      }),

      bypassBusReverb: pure((context, { checked, reverb, busIndex }) => {
        const tempReverbsBypass = context.busFxData.reverbsBypass;
        tempReverbsBypass[busIndex] = checked;
        currentMix.busFxData.reverbsBypass[busIndex] = checked;
        if (checked) {
          reverb.disconnect();
        } else {
          reverb.connect(Destination);
        }
        localStorage.setItem("currentMix", JSON.stringify(currentMix));
        return [assign({ reverbsBypass: tempReverbsBypass })];
      }),

      bypassTrackReverb: pure((context, { checked, reverb, trackIndex }) => {
        const tempReverbsBypass = context.reverbsBypass;
        tempReverbsBypass[trackIndex] = checked;
        currentTracks[trackIndex].reverbsBypass = checked;
        if (checked) {
          reverb.disconnect();
        } else {
          reverb.connect(Destination);
        }
        localStorage.setItem("currentTracks", JSON.stringify(currentTracks));
        return [assign({ reverbsBypass: tempReverbsBypass })];
      }),

      bypassTrackDelay: pure((context, { checked, delay, trackIndex }) => {
        const tempDelaysBypass = context.delaysBypass;
        tempDelaysBypass[trackIndex] = checked;
        currentTracks[trackIndex].delaysBypass = checked;
        if (checked) {
          delay.disconnect();
        } else {
          delay.connect(Destination);
        }
        localStorage.setItem("currentTracks", JSON.stringify(currentTracks));
        return [assign({ delaysBypass: tempDelaysBypass })];
      }),

      bypassTrackPitchShift: pure(
        (context, { checked, pitchShift, trackIndex }) => {
          const tempPitchShiftsBypass = context.pitchShiftsBypass;
          tempPitchShiftsBypass[trackIndex] = checked;
          currentTracks[trackIndex].pitchShiftsBypass = checked;
          if (checked) {
            pitchShift.disconnect();
          } else {
            pitchShift.connect(Destination);
          }
          localStorage.setItem("currentTracks", JSON.stringify(currentTracks));
          return [assign({ pitchShiftsBypass: tempPitchShiftsBypass })];
        }
      ),

      changeTrackPitchShiftMix: pure(
        (context, { value, pitchShift, trackIndex }) => {
          pitchShift.wet.value = value;
          const tempPitchShiftsMix = context.pitchShiftsMix;
          tempPitchShiftsMix[trackIndex] = value;
          currentTracks[trackIndex].pitchShiftsMix = value;
          localStorage.setItem("currentTracks", JSON.stringify(currentTracks));
          return [assign({ pitchShiftsMix: tempPitchShiftsMix })];
        }
      ),

      changeTrackPitchShiftPitch: pure(
        (context, { value, pitchShift, trackIndex }) => {
          pitchShift.pitch = value;
          const tempPitchShiftsPitch = context.pitchShiftsPitch;
          tempPitchShiftsPitch[trackIndex] = value;
          currentTracks[trackIndex].pitchShiftsPitch = value;
          localStorage.setItem("currentTracks", JSON.stringify(currentTracks));
          return [assign({ pitchShiftsPitch: tempPitchShiftsPitch })];
        }
      ),

      changeBusReverbMix: pure(
        (context, { value, reverb, busIndex, fxIndex }) => {
          reverb.wet.value = value;
          const tempReverbsMix = context.busFxData.reverbsMix;
          tempReverbsMix[busIndex][fxIndex] = value;
          currentMix.busFxData.reverbsMix[busIndex][fxIndex] = value;
          localStorage.setItem("currentMix", JSON.stringify(currentMix));
          return [assign({ reverbsMix: tempReverbsMix })];
        }
      ),

      changeTrackReverbMix: pure((context, { value, reverb, trackIndex }) => {
        reverb.wet.value = value;
        const tempReverbsMix = context.reverbsMix;
        tempReverbsMix[trackIndex] = value;
        currentTracks[trackIndex].reverbsMix = value;
        localStorage.setItem("currentTracks", JSON.stringify(currentTracks));
        return [assign({ reverbsMix: tempReverbsMix })];
      }),

      changeTrackReverbPredelay: pure(
        (context, { value, reverb, trackIndex }) => {
          reverb.preDelay = value;
          const tempReverbsPreDelay =
            context.trackFxData[trackIndex].reverbsPreDelay;
          tempReverbsPreDelay[trackIndex] = value;
          currentTracks[trackIndex].trackFxData.reverbsPreDelay[trackIndex] =
            value;
          localStorage.setItem("currentTracks", JSON.stringify(currentTracks));
          return [assign({ reverbsPreDelay: tempReverbsPreDelay })];
        }
      ),

      changeTrackReverbDecay: pure((context, { value, reverb, trackIndex }) => {
        reverb.decay = value;
        const tempReverbsDecay = context.trackFxData[trackIndex].reverbsDecay;
        tempReverbsDecay[trackIndex] = value;
        currentTracks[trackIndex].trackFxData.reverbsDecay[trackIndex] = value;
        localStorage.setItem("currentTracks", JSON.stringify(currentTracks));
        return [assign({ reverbsDecay: tempReverbsDecay })];
      }),

      changeBusReverbPredelay: pure(
        (context, { value, reverb, busIndex, fxIndex }) => {
          reverb.preDelay = value;
          const tempReverbsPreDelay = context.busFxData.reverbsPreDelay;
          tempReverbsPreDelay[busIndex][fxIndex] = value;
          currentMix.busFxData.reverbsPreDelay[busIndex][fxIndex] = value;
          localStorage.setItem("currentMix", JSON.stringify(currentMix));
          return [assign({ reverbsPreDelay: tempReverbsPreDelay })];
        }
      ),

      changeBusReverbDecay: pure(
        (context, { value, reverb, busIndex, fxIndex }) => {
          reverb.decay = value;
          const tempReverbsDecay = context.busFxData.reverbsDecay;
          tempReverbsDecay[busIndex][fxIndex] = value;
          currentMix.busFxData.reverbsDecay[busIndex][fxIndex] = value;
          localStorage.setItem("currentMix", JSON.stringify(currentMix));
          return [assign({ reverbsDecay: tempReverbsDecay })];
        }
      ),

      bypassBusDelay: pure((context, { checked, delay, busIndex }) => {
        const tempDelaysBypass = context.busFxData.delaysBypass;
        tempDelaysBypass[busIndex] = checked;
        currentMix.busFxData.delaysBypass[busIndex] = checked;
        if (checked) {
          delay.disconnect();
        } else {
          delay.connect(Destination);
        }
        localStorage.setItem("currentMix", JSON.stringify(currentMix));
        return [assign({ delaysBypass: tempDelaysBypass })];
      }),

      changeBusDelayMix: pure(
        (context, { value, delay, busIndex, fxIndex }) => {
          delay.wet.value = value;
          const tempDelaysMix = context.busFxData.delaysMix;
          tempDelaysMix[busIndex][fxIndex] = value;
          currentMix.busFxData.delaysMix[busIndex][fxIndex] = value;
          localStorage.setItem("currentMix", JSON.stringify(currentMix));
          return [assign({ delaysMix: tempDelaysMix })];
        }
      ),

      changeBusDelayTime: pure(
        (context, { value, delay, busIndex, fxIndex }) => {
          delay.delayTime.value = value;
          const tempDelaysTime = context.busFxData.delaysTime;
          tempDelaysTime[busIndex][fxIndex] = value;
          currentMix.busFxData.delaysTime[busIndex][fxIndex] = value;
          localStorage.setItem("currentMix", JSON.stringify(currentMix));
          return [assign({ delaysTime: tempDelaysTime })];
        }
      ),

      changeBusDelayFeedback: pure(
        (context, { value, delay, busIndex, fxIndex }) => {
          delay.feedback.value = value;
          const tempDelaysFeedback = context.busFxData.delaysFeedback;
          tempDelaysFeedback[busIndex][fxIndex] = value;
          currentMix.busFxData.delaysFeedback[busIndex][fxIndex] = value;
          localStorage.setItem("currentMix", JSON.stringify(currentMix));
          return [assign({ delaysFeedback: tempDelaysFeedback })];
        }
      ),

      changeTrackDelayMix: pure((context, { value, delay, trackIndex }) => {
        delay.wet.value = value;
        const tempDelaysMix = context.delaysMix;
        tempDelaysMix[trackIndex] = value;
        currentTracks[trackIndex].delaysMix = value;
        localStorage.setItem("currentTracks", JSON.stringify(currentTracks));
        return [assign({ delaysMix: tempDelaysMix })];
      }),

      changeTrackDelayTime: pure((context, { value, delay, trackIndex }) => {
        delay.delayTime.value = value;
        const tempDelaysTime = context.delaysTime;
        tempDelaysTime[trackIndex] = value;
        currentTracks[trackIndex].delaysTime = value;
        localStorage.setItem("currentTracks", JSON.stringify(currentTracks));
        return [assign({ delaysTime: tempDelaysTime })];
      }),

      changeTrackDelayFeedback: pure(
        (context, { value, delay, trackIndex }) => {
          delay.feedback.value = value;
          const tempDelaysFeedback = context.delaysFeedback;
          tempDelaysFeedback[trackIndex] = value;
          currentTracks[trackIndex].delaysFeedback = value;
          localStorage.setItem("currentTracks", JSON.stringify(currentTracks));
          return [assign({ delaysFeedback: tempDelaysFeedback })];
        }
      ),

      toggleBusPanel: pure((context, { busIndex }) => {
        const tempBusPanelsOpen = context.busPanelActive;
        tempBusPanelsOpen[busIndex] = !tempBusPanelsOpen[busIndex];
        localStorage.setItem(
          "currentMix",
          JSON.stringify({
            ...currentMix,
            busPanelActive: tempBusPanelsOpen,
          })
        );
        return [assign({ busPanelActive: tempBusPanelsOpen })];
      }),

      saveBusPanelsPosition: pure((context, { busIndex, position }) => {
        const tempBusPanelsPosition = context.busPanelPosition;
        tempBusPanelsPosition[busIndex] = position;
        localStorage.setItem(
          "currentMix",
          JSON.stringify({
            ...currentMix,
            busPanelPosition: tempBusPanelsPosition,
          })
        );
        return [assign({ busPanelPosition: tempBusPanelsPosition })];
      }),

      saveBusPanelsSize: pure((context, { busIndex, size }) => {
        const tempBusPanelsSize = context.busPanelSize;
        tempBusPanelsSize[busIndex] = size;
        localStorage.setItem(
          "currentMix",
          JSON.stringify({
            ...currentMix,
            busPanelSize: tempBusPanelsSize,
          })
        );
        return [assign({ busPanelSize: tempBusPanelsSize })];
      }),

      setTrackFx: pure((context, { trackIndex, target }) => {
        const id = target.id.at(-1);
        context.currentTrackFx[trackIndex][id] = target.value;
        const tempTrackFx = context.currentTrackFx;
        tempTrackFx[trackIndex][id] = target.value;
        currentTracks[trackIndex].fx[id] = target.value;
        localStorage.setItem(
          "currentTracks",
          JSON.stringify([...currentTracks])
        );
        return [assign({ currentTrackFx: tempTrackFx }), currentTracks];
      }),

      saveTrackPanelPosition: pure((context, { trackIndex, position }) => {
        const tempTrackPanelPosition = context.trackPanelPosition;
        tempTrackPanelPosition[trackIndex] = position;
        currentTracks[trackIndex].trackPanelPosition = position;
        localStorage.setItem("currentTracks", JSON.stringify(currentTracks));
        return [assign({ trackPanelPosition: tempTrackPanelPosition })];
      }),

      saveTrackPanelSize: pure((context, { trackIndex, size }) => {
        const tempTrackPanelData = context.trackPanelData;
        tempTrackPanelData[trackIndex].size[trackIndex] = size;
        currentTracks[trackIndex].trackPanelData[trackIndex] = size;
        localStorage.setItem("currentTracks", JSON.stringify(currentTracks));
        return [assign({ trackPanelData: tempTrackPanelData })];
      }),

      toggleTrackPanel: pure((context, { trackIndex }) => {
        const tempTrackPanelActive = context.trackPanelActive;
        tempTrackPanelActive[trackIndex].active[trackIndex] =
          !tempTrackPanelActive[trackIndex].active[trackIndex];
        currentTracks[trackIndex].trackPanelActive[trackIndex] =
          !tempTrackPanelActive[trackIndex].active[trackIndex];
        localStorage.setItem("currentTracks", JSON.stringify(currentTracks));
        return [assign({ trackPanelActive: tempTrackPanelActive })];
      }),
    },
  }
);

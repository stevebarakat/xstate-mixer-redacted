import { createMachine, assign } from "xstate";
import { pure } from "xstate/lib/actions";
import {
  start as initializeAudio,
  getContext as getAudioContext,
  Destination,
  Transport as t,
} from "tone";
import { dbToPercent, log } from "../utils/scale";
import { getSong } from "../utils/getSong";
import { roxanne } from "../assets/songs";
import type { TrackSettings } from "../types/global";

const actx = getAudioContext();
const [song, currentMix, currentTracks] = getSong(roxanne);

const initialPans = currentTracks.map(
  (currentTrack: TrackSettings) => currentTrack.pan
);
const initialMutes = currentTracks.map(
  (currentTrack: TrackSettings) => currentTrack.mute
);
const initialSolos = currentTracks.map(
  (currentTrack: TrackSettings) => currentTrack.solo
);

export const mixerMachine = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QFsCWAPMAnAxAJQFEBlAgFQG0AGAXUVAAcB7WVAF1UYDs6R1EA2AIwAWAHQBOYeIBMggBwB2AKwAaEAE9EAWgViAzIP7DK-aUoC+5tWky5CAdQCSAOQAiVWkhBMW7Ljz4EYSUlUTlxOWE9ZTVNBC1ouVFBM0trDGwcADEsjx4fNg5uL0DpPWlRJUo9cRMzWO1E5NSrEBtMgGEACQBBZwBxAgB9ADUAeQAZAFUAWQI8rwK-YtBA8P5k-gVxfkVVDW1BJUFRKX5KcWiLVvbcbr7BoZmel1HJ2fmafOZC-xLEORKMSUQSCBTyGIHeJ6c6iMw1OrXdK2HD3AbDABCUyIb2mcwWDB+ywC2mEKVOZOMpn2cT05UqCOpaTaGVwJFIQyxOKyAA0Cd4iUUeHEtNJtpVKAo5Cl9mtdpUxXoospmbdUb10UMAAp9flLIX-BBySWnJQGepQvRyDYKJVXVWsnCkMb9foTYZESZjPWCv6rAFKDb8cQyCE07TSSinMxSmUOlHO13up5TUifTyE3wG-1GvShYSRK4NBARSqxlrIzIYgCaOqIOMIIwIeAxPqzfqhovFVXLsoB8qUiuVSJZKLRj0bzYxOJmjj5X0WvpWvEaUtE1OLgnEJ2t4L28c6GonBCbLZxWsIrgIEx61bbv2XgS0xj0FLNMuLwg2NWC5pHavHYZJzPIYrw6W972JQ1n1BN8-2LHR9EMKkK1HKtax6etQOvCCF0zB9hQjbtJWlC05SSQdbWHA87iPYYrxvasZznSDs07MVxAlXs1HIhUqPtG5HUA7DGJxUhHHxPCBXbZcRQ4rjSL7I0ByHATK1oh56JwpihiyAgCFcDEeg6ABpViOzk4juJXZSKNUlVBNsUQABtGAAQwgVBOCgHAJjGHor3cKT9Q7QJjCjaRIv4QMLRFFIkgUYN31Q25RHoZy3PULyfJ1bF02+GSSSCbc4TDBDTAkQQQRi-9WTSjKsu80QvLcgBjdgADcwBwIgeibTlsW1PprxxMYtQIZxzMfRA9EoMRBzNWoNyhMkkjKObdgc9T6sy7LRDazrut6-quSG5wRqGMaJqmorZG-WaSI-KFZB3ShHpSurYFYRh6HoSAcC1RibsNQxOPKYRZD2cqKm3aqmUc7BRC+n6-ogZrOAO1Aup6vrMUGnVzomUbxsm4Kl0IhAlQ2Y0vyhmzEpOapjhqmike+37IH29qsaO3GBvPYaicukngdAOIXrCN7rMCfh+FfSgymo5lOEYCA4B4W4CoI6DQmNWWUPDeJ5J7RTWdcjzsq1qCc2MXW5ekRSEK3CopdNhGsB2xqoCttiwoqLc6SUS5ITiBQoxDSGtrQj30t2pqWu5rqfdCxAA+SLcRERYs6RONTo89vbMaTxdCsNWpkkuPNg8NyN81Dfd3bZlHIGT6agjBMItjKqEUn0V240b5GObRhPDtboqQkZvMjmW2kv0l2mo9SofUa5seS+1m3os7vcQ8QCXjXe65LCAA */
    id: "mixer",
    initial: "loading",
    tsTypes: {} as import("./mixerMachine.typegen").Typegen0,
    context: {
      mainVolume: currentMix.mainVolume,
      pan: initialPans,
      solo: initialSolos,
      mute: initialMutes,
    },
    on: {
      RESET: { actions: "reset", target: "stopped" },
      REWIND: { actions: "rewind" },
      FF: { actions: "fastForward" },
      CHANGE_MAIN_VOLUME: { actions: "changeMainVolume" },
      CHANGE_PAN: { actions: "changePan" },
      TOGGLE_SOLO: { actions: "toggleSolo" },
      TOGGLE_MUTE: { actions: "toggleMute" },
    },
    states: {
      loading: { on: { LOADED: "stopped" } },
      playing: {
        entry: "play",
        on: {
          PAUSE: { target: "stopped", actions: "pause" },
        },
      },
      stopped: {
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
        | { type: "CHANGE_MAIN_VOLUME" }
        | { type: "LOADED" }
        | { type: "PAUSE" }
        | { type: "PLAY" }
        | { type: "CHANGE_PAN" }
        | { type: "TOGGLE_SOLO" }
        | { type: "TOGGLE_MUTE" },
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
        const scaled = dbToPercent(log(value));
        const volume = () => {
          Destination.volume.value = scaled;
        };
        currentMix.mainVolume = value;
        localStorage.setItem("currentMix", JSON.stringify(currentMix));
        return [assign({ mainVolume: value }), volume];
      }),

      changePan: pure((context, { value, trackIndex, channel }) => {
        const currentTracksString = localStorage.getItem("currentTracks");
        const currentTracks =
          currentTracksString && JSON.parse(currentTracksString);
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
        const currentTracksString = localStorage.getItem("currentTracks");
        const currentTracks =
          currentTracksString && JSON.parse(currentTracksString);
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
        const currentTracksString = localStorage.getItem("currentTracks");
        const currentTracks =
          currentTracksString && JSON.parse(currentTracksString);
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
    },
  }
);

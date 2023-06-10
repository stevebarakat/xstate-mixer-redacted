import type { Song } from "../types/global";

export const defaultCurrentMix = {
  mainVolume: -32,
  busVolumes: [0.61, 0.61],
};

export function getSong(defaultSong: Song) {
  const defaultSongString = JSON.stringify(defaultSong);
  const songString = localStorage.getItem("song");
  const parsedSong = songString && JSON.parse(songString);

  const defaultCurrentTracks = defaultSong.tracks.map((track) => ({
    name: track.name,
    path: track.path,
    volume: -32,
    pan: 0,
    mute: false,
    solo: false,
    fxName: ["nofx", "nofx"],
    fxNode: [null, null],
    sends: [false, false],
    trackPanelPosition: { x: 0, y: 0 },
    trackPanelSize: { width: "325px", height: "auto" },
    reverbsBypass: false,
    reverbsMix: 0.5,
    reverbsPreDelay: 0.5,
    reverbsDecay: 0.5,
    delaysBypass: false,
    delaysMix: 0.5,
    delaysTime: 0.5,
    delaysFeedback: 0.5,
    pitchShiftsBypass: false,
    pitchShiftsMix: 0.5,
    pitchShiftsPitch: 0,
  }));

  let song;
  if (parsedSong) {
    song = parsedSong;
  } else {
    localStorage.setItem("song", defaultSongString);
    song = defaultSong;
  }

  const currentMixString = localStorage.getItem("currentMix");
  let currentMix = currentMixString && JSON.parse(currentMixString);
  const currentTracksString = localStorage.getItem("currentTracks");
  let currentTracks = currentTracksString && JSON.parse(currentTracksString);

  if (!currentMix) {
    currentMix = defaultCurrentMix;
    localStorage.setItem("currentMix", JSON.stringify(currentMix));
  }

  if (!currentTracks) {
    currentTracks = defaultCurrentTracks;
    localStorage.setItem("currentTracks", JSON.stringify(currentTracks));
  }

  return [song, currentMix, currentTracks];
}

import { localStorageGet, localStorageSet } from ".";

export const defaultCurrentMix = {
  mainVolume: -32,
  busVolumes: [0.61, 0.61],
};

export function getSong(defaultSong: SourceSong) {
  const defaultSongString = JSON.stringify(defaultSong);
  const songString = localStorage.getItem("song");
  const savedSong = songString && JSON.parse(songString);

  const defaultCurrentTracks = defaultSong.tracks.map((track) => ({
    name: track.name,
    path: track.path,
    volume: -32,
    pan: 0,
    mute: false,
    solo: false,
    fxName: ["nofx", "nofx"],
    sends: [false, false],
    trackPanelPosition: { x: 0, y: 0 },
    trackPanelSize: { width: "325px", height: "auto" },
    reverbsMix: [0.5, 0.5],
    reverbsPreDelay: [0.5, 0.5],
    reverbsDecay: [0.5, 0.5],
    reverbsBypass: [false, false],
    delaysMix: [0.5, 0.5],
    delaysTime: [1, 1],
    delaysFeedback: [0.5, 0.5],
    pitchShiftsBypass: [false, false],
    pitchShiftsMix: [0.5, 0.5],
    pitchShiftsPitch: [5, 5],
  }));

  let song;
  if (savedSong) {
    song = savedSong;
  } else {
    localStorage.setItem("sourceSong", defaultSongString);
    song = defaultSong;
  }

  let currentMix = localStorageGet("currentMix");
  let currentTracks = localStorageGet("currentTracks");

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

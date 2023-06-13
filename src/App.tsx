import { useState } from "react";
import { Mixer } from "./components/Mixer";
import { justDance, roxanne, aDayInTheLife, blueMonday } from "./assets/songs";
import { createActorContext } from "@xstate/react";
import { mixerMachine } from "./machines/mixerMachine";
import { localStorageGet, localStorageSet } from "./utils";

export const MixerMachineContext = createActorContext(mixerMachine);

function App() {
  const [sourceSong, setSourceSong] = useState(
    () => localStorageGet("sourceSong") ?? roxanne
  );

  function onChange(e: React.FormEvent<HTMLSelectElement>): void {
    switch (e.currentTarget.value) {
      case "roxanne":
        setSourceSong(roxanne);
        localStorageSet("sourceSong", roxanne);
        window.location.reload();
        break;
      case "aDayInTheLife":
        setSourceSong(aDayInTheLife);
        localStorageSet("sourceSong", aDayInTheLife);
        window.location.reload();
        break;
      case "blueMonday":
        setSourceSong(blueMonday);
        localStorageSet("sourceSong", blueMonday);
        window.location.reload();
        break;
      case "justDance":
        setSourceSong(justDance);
        localStorageSet("sourceSong", justDance);
        window.location.reload();
        break;

      default:
        break;
    }
  }

  return (
    <>
      <MixerMachineContext.Provider>
        <Mixer sourceSong={sourceSong} />
      </MixerMachineContext.Provider>
      <select name="songs" id="song-select" onChange={onChange}>
        <option value="">Choose a song:</option>
        <option value="roxanne">The Police - Roxanne</option>
        <option value="aDayInTheLife">The Beatles - A Day In The Life</option>
        <option value="blueMonday">New Order - Blue Monday</option>
        <option value="justDance">Lady Gaga - Just Dance</option>
      </select>
    </>
  );
}

export default App;

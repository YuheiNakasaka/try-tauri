import { useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import Image from "next/image";
import reactLogo from "../assets/react.svg";
import tauriLogo from "../assets/tauri.svg";
import nextLogo from "../assets/next.svg";
import {open} from "@tauri-apps/api/dialog";
import { emit } from "@tauri-apps/api/event";

type MyAdder = {
  sum: number;
  msg: string;
}

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [sum, setSum] = useState(0);
  const [name, setName] = useState("");

  async function greet() {
    setGreetMsg(await invoke("greet", { name }));
  }

  async function simpleCommand() {
    invoke('simple_command');
  }

  async function addCommand() {
    invoke('add_command', {adder: {sum: sum, msg: 'my message'}}).then((adder: MyAdder) => {
      setSum(adder.sum);
    });
  }

  function openFiles() {
    open().then(files => console.log(files));
  }

  function emitMessage() {
    emit('front-to-back', "Hello from frontend");
  }

  return (
    <div className="container">
      <h1>Welcome to Tauri!!!</h1>

      <div className="row">
        <span className="logos">
          <a href="https://nextjs.org" target="_blank">
            <Image
              width={144}
              height={144}
              src={nextLogo}
              className="logo next"
              alt="Next logo"
            />
          </a>
        </span>
        <span className="logos">
          <a href="https://tauri.app" target="_blank">
            <Image
              width={144}
              height={144}
              src={tauriLogo}
              className="logo tauri"
              alt="Tauri logo"
            />
          </a>
        </span>
        <span className="logos">
          <a href="https://reactjs.org" target="_blank">
            <Image
              width={144}
              height={144}
              src={reactLogo}
              className="logo react"
              alt="React logo"
            />
          </a>
        </span>
      </div>

      <p>
        Click on the Tauri, Next, and React logos to learn more about each
        framework.
      </p>

      <div className="row">
        <div>
          <input
            id="greet-input"
            onChange={(e) => setName(e.currentTarget.value)}
            placeholder="Enter a name..."
          />
          <button type="button" onClick={() => greet()}>
            Greet
          </button>
        </div>
        <div>
          <button onClick={simpleCommand}>simple</button>
        </div>
        <div>
          <button onClick={addCommand}>add: { sum }</button>
        </div>
        <div>
          <button onClick={openFiles}>file</button>
        </div>
        <div>
          <button onClick={emitMessage}>emit</button>
        </div>
      </div>

      <p>{greetMsg}</p>
    </div>
  );
}

export default App;

import { createElement } from "react";
import { render } from "react-dom";
import { App } from "./App";
import { useStore } from "./store/store";

// @ts-ignore
import modelUrl from "../assets/Durian.glb";

const root = document.createElement("div");
root.id = "root";
document.body.appendChild(root);
render(createElement(App), root);

window.navigator?.serviceWorker?.register("service-worker.js");

useStore.getState().addStageFromUrl(modelUrl);

const run = async () => {
  await fetch("/start-socket");

  const url = `ws://${window.location.host}/`;

  const ws = new WebSocket(url);

  ws.addEventListener("error", (event) => {
    console.log("error", event);
  });
  ws.addEventListener("message", async (event) => {
    console.log(JSON.parse(await event.data.text()));
  });
  ws.addEventListener("open", (event) => {
    const topic = "flowers";

    ws.send(JSON.stringify({ topic, action: "subscribe" }));

    ws.send(
      JSON.stringify({
        topic,
        action: "broadcast",
        data: Int8Array.from([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]),
      })
    );
  });
};

run();

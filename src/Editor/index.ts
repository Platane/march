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

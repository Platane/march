import { createElement } from "react";
import { render } from "react-dom";

const App = () => null;

const root = document.createElement("div");
root.id = "root";
document.body.appendChild(root);
render(createElement(App), root);

console.log("client");

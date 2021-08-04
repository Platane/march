import { css } from "@linaria/core";
import { createElement } from "react";
import { render } from "react-dom";
import { App } from "./App";

const root = document.createElement("div");
root.id = "root";
document.body.appendChild(root);
render(createElement(App), root);

export const globals = css`
  :global() {
    html {
      box-sizing: border-box;
      user-select: none;
      font-family: Helvetica, Arial, sans-serif;
    }

    body {
      margin: 0;
    }

    *,
    *:before,
    *:after {
      box-sizing: inherit;
      user-select: inherit;
    }
  }
`;

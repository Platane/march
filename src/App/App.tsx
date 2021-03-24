import React from "react";
import { css } from "@linaria/core";
import { Viewer } from "./Viewer/Viewer";
import { ViewerUi } from "./ViewerUi/ViewerUi";
import { DropZone } from "./DropZone";
import { useStore } from "./store/store";
import { Preview } from "./Preview/Preview";

export const App = () => {
  const ready = useStore((s) => !!s.stages?.[0]?.models?.[0]);

  return (
    <>
      {!ready && <DropZone />}
      {ready && (
        <>
          <Viewer />
          <ViewerUi />
          <Preview />
        </>
      )}
    </>
  );
};

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

import React, { useEffect } from "react";
import { css } from "@linaria/core";
import { Viewer } from "./Viewer/Viewer";
import { DropZone } from "./DropZone";
import { useStore } from "./store/store";
import { Preview } from "./Preview/Preview";

// @ts-ignore
import modelUrl from "../assets/Durian.glb";

export const App = () => {
  const ready = useStore((s) => !!s.stages?.[0]?.models?.[0]);

  const addStageFromUrl = useStore((s) => s.addStageFromUrl);
  useEffect(() => addStageFromUrl(modelUrl), []);

  const setCamera = useStore((s) => s.setCamera);
  useEffect(() => {
    let cancel: number;
    const loop = () => {
      setCamera();
      cancel = requestAnimationFrame(loop);
    };
    loop();
    return () => {
      cancelAnimationFrame(cancel);
    };
  }, []);

  return (
    <>
      {!ready && <DropZone />}
      {ready && (
        <>
          <Viewer />
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

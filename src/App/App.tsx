import React, { useEffect } from "react";
import { styled } from "@linaria/react";
import { css } from "@linaria/core";
import { Viewer } from "./Viewer/Viewer";
import { DropZone } from "./DropZone";
import { useStore } from "./store/store";

// @ts-ignore
import modelUrl from "../assets/Durian.glb";

export const App = () => {
  const ready = useStore((s) => !!s.stages?.[0]?.models?.[0]);

  const { addStageFromUrl, setCamera } = useStore();
  useEffect(() => addStageFromUrl(modelUrl), []);

  useEffect(() => {
    fetch(`/upload`, {
      method: "post",
      body: new Int8Array(Array.from({ length: 99999 }, () => 3)),
    })
      .then((res) => res.text())
      .then((url) => console.log(url));
  }, []);

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
      {ready && <Viewer />}
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

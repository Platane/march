import React, { Suspense } from "react";
import { useStore } from "../store/store";
import { Camera } from "./Camera";
import { Model } from "./Model";

export const Models = () => {
  const modelsLength = useStore((s) => s.stages[0]?.models.length);

  return (
    <>
      {Array.from({ length: modelsLength }, (_, index) => (
        <Suspense key={index} fallback={null}>
          <Model index={index} />
        </Suspense>
      ))}
    </>
  );
};

export const Stage = () => (
  <group>
    <Camera />
    <Models />
  </group>
);

import React from "react";
import * as THREE from "three";
import { useStore } from "../store/store";
import { selectStage } from "../store/selector";

export const Light = () => {
  const { directionalLight } = useStore((s) => selectStage(s)?.light ?? {});

  return (
    <>
      <ambientLight intensity={1} layers={1 as any} />

      {directionalLight && (
        <directionalLight
          position={[
            directionalLight.direction.x,
            directionalLight.direction.y,
            directionalLight.direction.z,
          ]}
          intensity={directionalLight?.intensity}
          color={directionalLight.color}
        />
      )}
    </>
  );
};

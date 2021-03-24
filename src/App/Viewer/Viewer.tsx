import React from "react";
import { styled } from "@linaria/react";
import { Canvas } from "react-three-fiber";
import { OrbitControls } from "drei";
import { useStore } from "../store/store";
import { Stage } from "./Stage";
import { Light } from "./Light";

export const Viewer = () => (
  <Container>
    <Canvas camera={{ near: 0.1, far: 20 }} pixelRatio={[1, 4]}>
      <OrbitControls
        minDistance={1}
        maxDistance={10}
        enabled={useStore((s) => !s.cameraLocked)}
      />

      <Light />

      <axesHelper args={[1]} />

      <Stage />
    </Canvas>
  </Container>
);

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
`;

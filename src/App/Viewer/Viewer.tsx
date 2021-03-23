import React from "react";
import * as THREE from "three";
import { styled } from "@linaria/react";
import { Canvas } from "react-three-fiber";
import { OrbitControls } from "drei";
import { Stage } from "./Stage";

export const Viewer = () => (
  <Container>
    <Canvas camera={{ near: 0.1, far: 20 }} pixelRatio={[1, 4]}>
      <OrbitControls minDistance={1} maxDistance={10} />

      <ambientLight intensity={1} />

      <axesHelper args={[1]} layers={1 as any} />

      <Stage />
    </Canvas>
  </Container>
);

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
`;

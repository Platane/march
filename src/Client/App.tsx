import React, { Suspense, useEffect, useRef } from "react";
import { styled } from "@linaria/react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  Environment,
  OrbitControls,
  PointerLockControls,
  Stage,
} from "@react-three/drei";
import * as THREE from "three";
import { World } from "./World";
import { Device } from "./Device";

export const App = () => (
  <Container>
    <Canvas camera={{ near: 0.1, far: 20 }} dpr={[1, 4]} shadows>
      <PointerLockControls />
      <KeyBoardControls />

      <Suspense fallback={null}>
        <Stage />
      </Suspense>

      <World />
      <Device />

      <axesHelper args={[1]} layers={1} />
    </Canvas>
  </Container>
);

const useKeyboardDirection = () => {
  const direction = useRef(new THREE.Vector3());

  useEffect(() => {
    const pressed: Record<string, boolean> = {};

    const update = () => {
      direction.current.set(0, 0, 0);

      if (pressed.ArrowUp || pressed.KeyW) direction.current.z -= 1;
      if (pressed.ArrowDown || pressed.KeyS) direction.current.z += 1;
      if (pressed.ArrowLeft || pressed.KeyA) direction.current.x -= 1;
      if (pressed.ArrowRight || pressed.KeyD) direction.current.x += 1;

      direction.current.normalize();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      pressed[e.code] = true;
      update();
    };

    const onKeyUp = (e: KeyboardEvent) => {
      pressed[e.code] = false;
      update();
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  return direction;
};

const KeyBoardControls = () => {
  const direction = useKeyboardDirection();

  useFrame(({ camera }, dt) => {
    v.copy(direction.current).applyQuaternion(camera.quaternion);

    v.y = 0;
    v.normalize();

    camera.position.addScaledVector(v, dt * 5);
    camera.position.y = 1.6;
  });

  return null;
};
const v = new THREE.Vector3();

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: fixed;
`;

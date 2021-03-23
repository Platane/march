import { RoundedBox } from "drei";
import React, { useEffect, useRef, useState } from "react";
import { useFrame } from "react-three-fiber";
import * as THREE from "three";
import { State, Camera as CameraType, useStore } from "../store/store";
import { useSubscribe } from "../store/useSubscribe";
import { InlinePreview } from "./InlinePreview";

const v = new THREE.Vector3();

export const Camera = () => {
  const [{ texture, update }] = useState(() => createRenderer());

  const ref = useRef<THREE.Group>();

  useEffect(() => ref.current!.traverse((o) => o.layers.set(1)), []);

  useSubscribe(
    (camera) => {
      const group = ref.current!;

      group.position.copy(camera.position as any);
      group.lookAt(camera.target.x, camera.target.y, camera.target.z);

      const [arrowHelper] = group.children as any;
      v.copy(camera.target as any);
      arrowHelper.setLength(v.distanceTo(group.position));
    },
    (s: State) => s.stages[0]?.camera
  );

  useFrame(({ scene, ...rest }) => {
    rest.camera.layers.enableAll();

    const camera = useStore.getState().stages[0]?.camera;
    update(scene, camera);
  });

  return (
    <group ref={ref}>
      <arrowHelper args={[dir, origin, length, color, headLength, headWidth]} />

      <RoundedBox
        args={[0.08, 0.14, 0.008]}
        position={[0, -0.05, 0]}
        radius={0.004}
        smoothness={3}
      >
        <meshBasicMaterial attach="material" color={color} />
      </RoundedBox>

      <mesh position={[0, -0.05, -0.0052]} rotation={[0, Math.PI, 0]}>
        <planeBufferGeometry args={[0.064, 0.124, 1, 1]} />
        <meshBasicMaterial map={texture} />
      </mesh>

      {!false && <InlinePreview canvas={texture.image} />}
    </group>
  );
};

const createRenderer = () => {
  const camera = new THREE.PerspectiveCamera();
  camera.layers.disableAll();
  camera.layers.enable(0);

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(255, 256);
  renderer.setClearColor("#fff");
  renderer.outputEncoding = THREE.sRGBEncoding;

  const texture = new THREE.Texture(renderer.domElement);

  const update = (scene: THREE.Scene, c: CameraType) => {
    camera.position.copy(c.position as any);
    camera.lookAt(v.copy(c.target as any));
    camera.fov = c.fov;
    camera.updateProjectionMatrix();
    camera.updateMatrix();

    renderer.clear();
    renderer.render(scene, camera);

    texture.needsUpdate = true;
  };

  return { texture, update };
};

const dir = new THREE.Vector3(0, 0, 1);
const origin = new THREE.Vector3(0, 0, 0);
const length = 0.5;
const color = new THREE.Color("orange");
const headLength = 0.14;
const headWidth = 0.06;

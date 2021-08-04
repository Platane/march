import { RoundedBox, useFBO } from "@react-three/drei";
import React, { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const v = new THREE.Vector3();

export const Device = () => {
  const target = useFBO(256, 512);
  const [deviceCamera] = useState(() => new THREE.PerspectiveCamera(60, 1));

  const container = useRef<THREE.Group>();

  useFrame(({ camera, scene, gl }) => {
    if (!container.current) return;

    container.current.setRotationFromQuaternion(camera.quaternion);

    container.current.position
      .set(0, -0.022, -0.2)
      .applyQuaternion(camera.quaternion)
      .add(camera.position);

    deviceCamera.layers.set(0);
    deviceCamera.layers.toggle(1);
    deviceCamera.setRotationFromQuaternion(container.current.quaternion);
    deviceCamera.position.copy(container.current.position);
    deviceCamera.updateMatrix();

    gl.clear();
    gl.setRenderTarget(target);
    gl.render(scene, deviceCamera);
    gl.setRenderTarget(null);
  });

  return (
    <group ref={container}>
      <RoundedBox
        args={[0.08, 0.14, 0.008]}
        position={[0, -0.05, 0]}
        radius={0.004}
        smoothness={3}
      >
        <meshStandardMaterial attach="material" color={color} />
      </RoundedBox>

      <mesh position={[0, -0.05, 0.0052]} rotation={[0, 0, 0]}>
        <planeBufferGeometry args={[0.064, 0.124, 1, 1]} />
        <meshBasicMaterial map={target.texture} />
      </mesh>
    </group>
  );
};

const createRenderer = () => {
  const camera = new THREE.PerspectiveCamera();
  camera.layers.set(1);

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(255, 256);
  renderer.setClearColor("#fff");
  renderer.outputEncoding = THREE.sRGBEncoding;

  const texture = new THREE.Texture(renderer.domElement);

  const update = (scene: THREE.Scene) => {
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

const color = new THREE.Color("#333");

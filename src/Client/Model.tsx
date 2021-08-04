import React, { Suspense, useEffect, useRef } from "react";
import { styled } from "@linaria/react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PointerLockControls, Stage, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { Room } from "./Room";
import { Device } from "./Device";
import { useStore } from "./store/store";

export const Model = () => {
  const scene = useStore((s) => s.scene);
  const gltf = useGLTF(scene.modelUrl);

  const container = useRef<THREE.Group | null>(null);

  useEffect(() => {
    container.current?.children[0]?.position.set(
      scene.initialPosition.x,
      0,
      scene.initialPosition.y
    );
  }, [scene.initialPosition]);

  useFrame(({ camera, scene }) => {
    if (!container.current) return;

    const deviceCamera: THREE.PerspectiveCamera = camera.userData.deviceCamera;

    raycaster.setFromCamera(coords, camera);
    const [hit] = raycaster
      .intersectObject(scene, true)
      .filter((h) => isRoomMesh(h.object));

    if (hit) {
      container.current.visible = true;
      container.current.position.copy(hit.point);

      const v = new THREE.Vector3(0, 0, 1).applyQuaternion(camera.quaternion);
      v.y = 0;
      v.add(container.current.position);
      container.current.lookAt(v);

      const n = hit?.face?.normal
        .clone()
        .applyMatrix3(
          new THREE.Matrix3().setFromMatrix4(hit.object.matrixWorld)
        );

      container.current.children[1].visible = container.current.children[0].visible = !!(
        n && n.dot(up) > 0.5
      );
    } else {
      container.current.visible = false;
    }
  });

  return (
    <group ref={container} name="world-position-container">
      <group name="transform-container">
        <primitive object={gltf.scene} />
      </group>

      <axesHelper args={[1]} />

      <mesh>
        <sphereBufferGeometry args={[0.01, 16, 16]} />
        <meshBasicMaterial color="purple" />
      </mesh>
    </group>
  );
};

const up = new THREE.Vector3(0, 1, 0);
const coords = { x: 0, y: 0 };
const raycaster = new THREE.Raycaster();

const isRoomMesh = (o: THREE.Object3D | null): boolean => {
  if (!o) return false;
  if (o.name === "room") return true;
  return isRoomMesh(o.parent);
};

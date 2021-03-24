import React, { useCallback, useEffect, useRef } from "react";
import { useGLTF } from "drei";
import * as THREE from "three";
import { Transform, useStore } from "../store/store";
import { useSubscribe } from "../store/useSubscribe";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import { useThree } from "react-three-fiber";

export const Model = ({ index }: { index: number }) => {
  useSubscribe(
    (transform: Transform) => {
      const group = ref.current!;
      group.scale.setScalar(transform.scale);
      group.position.copy(transform.position as any);
      group.quaternion.copy(transform.rotation as any);
      group.children[0].position.copy(transform.origin as any);
    },
    (s) => s.stages[0]?.models?.[index].transform,
    [index]
  );

  const ref = useRef<THREE.Group>();

  const modelUrl = useStore(
    useCallback((s) => s.stages[0]?.models?.[index].url, [index])
  );

  const gltf = useGLTF(modelUrl);

  useEffect(() => {
    const container = ref.current?.children?.[0];
    if (!gltf) return;
    if (!container) return;

    container.add(gltf.scene);
    gltf.scene.traverse((o) => o.layers.set(1));

    return () => {
      container.remove(gltf.scene);
    };
  }, [gltf]);

  useTransform(index, ref);

  const selectModel = useStore((s) => s.selectModel);

  return (
    <group ref={ref} onClick={() => selectModel(index)} userData={{ index }}>
      <group />
    </group>
  );
};

const useTransform = (
  index: number,
  ref: React.MutableRefObject<THREE.Group | undefined>
) => {
  const tool = useStore(
    useCallback(
      (s) => (s.currentModelIndex === index && s.currentTool) ?? null,
      [index]
    )
  );

  const transformStart = useStore((s) => s.transformStart);
  const transformEnd = useStore((s) => s.transformEnd);
  const transformChange = useStore((s) => s.transformChange);

  const {
    camera,
    scene,
    gl: { domElement },
  } = useThree();

  useEffect(() => {
    if (!tool) return;

    const control = new TransformControls(camera, domElement);

    scene.add(control);

    const object = ref.current!;

    control.attach(object);

    control.addEventListener("objectChange", () => {
      switch (tool) {
        case "translate":
          return transformChange(index, { position: object.position });
        case "rotate":
          return transformChange(index, {
            rotation: {
              x: object.quaternion.x,
              y: object.quaternion.y,
              z: object.quaternion.z,
              w: object.quaternion.w,
            },
          });
        case "scale":
          return transformChange(index, { scale: object.scale.y });
      }
    });
    control.addEventListener("mouseDown", transformStart);
    control.addEventListener("mouseUp", transformEnd as any);
    control.setMode(tool);

    switch (tool) {
      case "translate":
      case "rotate":
        control.setSpace("world");
        break;

      case "scale":
        control.setSpace("local");
        control.showX = false;
        control.showZ = false;
        break;
    }

    return () => {
      scene.remove(control);
      control.detach();
      control.clear();
      control.dispose();
    };
  }, [tool]);
};

import React, { useCallback, useEffect, useRef } from "react";
import { useGLTF } from "drei";
import * as THREE from "three";
import { Transform, useStore } from "../store/store";
import { useSubscribe } from "../store/useSubscribe";

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

    return () => {
      container.remove(gltf.scene);
    };
  }, [gltf]);

  return (
    <group ref={ref}>
      <group />
    </group>
  );
};

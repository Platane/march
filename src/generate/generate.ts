import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { GLTFExporter } from "three/examples/jsm/exporters/GLTFExporter";
import * as THREE from "three";
import type { Stage } from "../App/store/store";

const loader = new GLTFLoader();
const exporter = new GLTFExporter();

const loadGlb = loader.loadAsync.bind(loader);
const exportGlb = (o: THREE.Object3D, animations: THREE.AnimationClip[] = []) =>
  new Promise<ArrayBuffer>((resolve) =>
    exporter.parse(o, resolve as any, {
      animations,
      embedImages: true,
      binary: true,
    })
  );

export const generateGltf = async (stage: Stage) => {
  const gltfs = await Promise.all(stage.models.map((m) => loadGlb(m.url)));

  const animations: THREE.AnimationClip[] = [];
  const root = new THREE.Group();
  stage.models.map((m, i) => {
    const gltf = gltfs[i];

    animations.push(...gltf.animations);

    const origin = new THREE.Group();
    origin.position.copy(m.transform.origin as any);

    const container = new THREE.Group();
    container.quaternion.copy(m.transform.rotation as any);
    container.position.copy(m.transform.position as any);
    container.scale.setScalar(m.transform.scale);

    root.add(container);
    container.add(origin);
    origin.add(gltf.scene);
  });

  const camera = new THREE.PerspectiveCamera(stage.camera.fov, 1);
  camera.position.copy(stage.camera.position as any);
  camera.lookAt(
    stage.camera.target.x,
    stage.camera.target.y,
    stage.camera.target.z
  );
  root.add(camera);

  if (stage.light?.directionalLight) {
    const light = new THREE.DirectionalLight(
      stage.light.directionalLight.color,
      stage.light.directionalLight.intensity
    );
    light.position.copy(stage.light.directionalLight.direction as any).negate();
  }

  const glb = await exportGlb(root, animations);

  return glb;
};

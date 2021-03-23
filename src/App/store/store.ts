import create from "zustand";

export type Vec2 = { x: number; y: number };
export type Vec3 = { x: number; y: number; z: number };
export type Quat = { x: number; y: number; z: number; w: number };
export type Transform = {
  origin: Vec3;
  position: Vec3;
  rotation: Quat;
  scale: number;
};

export type Model = {
  transform: Transform;
  url: string;
};

export type Camera = {
  target: Vec3;
  position: Vec3;
  fov: number;
};
export type ArCamera = {
  direction: Vec2;
  position: Vec2;
};

export type DirectionalLight = {
  position: Vec3;
  direction: Vec3;
  intensity: number;
  color: number;
};

export type Stage = {
  models: Model[];
  camera: Camera;
  arCamera: ArCamera;
  light?: {
    environnementMap: { url: string };
    directionalLight: DirectionalLight;
  };
};

export type Api = {
  addStageFromFile: (file: File) => void;
  addStageFromUrl: (url: string) => void;
  setCamera: () => void;
};
export type State = {
  stages: Stage[];
};

export const useStore = create<State & Api>((set) => ({
  stages: [],

  addStageFromFile: async (file) => {
    const fr = new FileReader();

    const promise = new Promise((r) => fr.addEventListener("load", r));

    fr.readAsDataURL(file);

    await promise;

    set((s) => ({ ...s, stages: [createStage(fr.result as string)] }));
  },

  addStageFromUrl: async (url) =>
    set((s) => ({ ...s, stages: [createStage(url)] })),

  setCamera: () =>
    set((s) => {
      const { camera } = s.stages[0];

      const a = (0.1 * Date.now()) / 1000;

      const position = {
        x: 0 + 0.3 * Math.cos(a),
        y: 0.5,
        z: 0.2 + 0.3 * Math.sin(a),
      };

      return {
        ...s,
        stages: [
          {
            ...s.stages[0],
            camera: { ...camera, position },
          },
        ],
      };
    }),
}));

const createStage = (url: string) => {
  const model = {
    transform: {
      origin: { x: 0, y: 0.2, z: 0 },
      position: { x: 0.2, y: 0, z: 0.2 },
      rotation: { x: 0, y: 0, z: 0.49999999999999994, w: 0.8660254037844387 },
      scale: 1,
    },
    url,
  };

  const camera = {
    target: { x: 0, y: 0, z: 0 },
    position: { x: 0.5, y: 1, z: 1 },
    fov: 60,
  };
  const arCamera = {
    position: { x: 0, y: 0 },
    direction: { x: 0, y: 0 },
  };

  const stage = {
    models: [model],
    camera,
    arCamera,
  };

  return stage;
};

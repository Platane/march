import create from "zustand";
import { Vec3 } from "../../Editor/store/types";

// @ts-ignore
import modelUrl from "../../assets/Durian.glb";

export type State = {
  deviceUp: boolean;
  scene: { modelUrl: string; initialPosition: Vec3 };
};
export type Api = {
  toggleDevice: () => void;
};

export const useStore = create<State & Api>((set) => ({
  deviceUp: false,
  scene: { modelUrl, initialPosition: { x: 0, y: 0, z: 0 } },

  toggleDevice: () => set(({ deviceUp }) => ({ deviceUp: !deviceUp })),
}));

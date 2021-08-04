import create from "zustand";
import { Vec2, Vec3 } from "../../Editor/store/types";

// @ts-ignore
import modelUrl from "../../assets/Durian.glb";

export type State = {
  deviceUp: boolean;
  scene: { modelUrl: string; initialPosition: Vec2; autoScale: boolean };
  anchor: { x: number; y: number; z: number } | null;
};
export type Api = {
  toggleDevice: () => void;
};

export const useStore = create<State & Api>((set) => ({
  deviceUp: false,
  scene: { modelUrl, initialPosition: { x: 0.5, y: 0 }, autoScale: false },
  anchor: null,

  toggleDevice: () => set(({ deviceUp }) => ({ deviceUp: !deviceUp })),
}));

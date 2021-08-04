import create from "zustand";
import { Vec3 } from "../../Editor/store/types";

export type Api = {};
export type State = {};

export const useStore = create<State & Api>((set) => ({}));

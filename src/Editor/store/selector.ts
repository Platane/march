import type { State } from "./store";
import { createSelector } from "reselect";

export const selectStage = (state: State) => state.stages?.[0];

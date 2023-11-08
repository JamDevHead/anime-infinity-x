import { CombineStates } from "@rbxts/reflex";
import { playersSlice } from "./players";
import { enemiesSlice } from "@/shared/reflex/slices/enemies";

export type SharedState = CombineStates<typeof slices>;
export const slices = {
	players: playersSlice,
	enemies: enemiesSlice,
};

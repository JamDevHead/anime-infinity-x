import { CombineStates } from "@rbxts/reflex";
import { enemiesSlice } from "./enemies";
import { playersSlice } from "./players";
import { fighterTargetSlice } from "@/shared/store/fighter-target";
import { enemySelectionSlice } from "@/shared/store/enemy-selection";

export type SharedState = CombineStates<typeof slices>;
export const slices = {
	players: playersSlice,
	enemies: enemiesSlice,
	fighterTarget: fighterTargetSlice,
	enemySelection: enemySelectionSlice,
};

import { CombineStates } from "@rbxts/reflex";
import { enemiesSlice } from "./enemies";
import { playersSlice } from "./players";
import { eggsSlice } from "@/shared/store/eggs";
import { enemySelectionSlice } from "@/shared/store/enemy-selection";
import { fighterTargetSlice } from "@/shared/store/fighter-target";

export type SharedState = CombineStates<typeof slices>;
export const slices = {
	players: playersSlice,
	enemies: enemiesSlice,
	fighterTarget: fighterTargetSlice,
	enemySelection: enemySelectionSlice,
	eggs: eggsSlice,
};

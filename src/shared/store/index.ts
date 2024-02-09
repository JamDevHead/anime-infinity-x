import { CombineStates } from "@rbxts/reflex";
import { enemiesSlice } from "./enemies";
import { playersSlice } from "./players";
import { dpsSlice } from "@/shared/store/dps";
import { eggsSlice } from "@/shared/store/eggs";
import { fighterTargetSlice } from "@/shared/store/fighter-target";
import { storeSlice } from "@/shared/store/store";

export type SharedState = CombineStates<typeof slices>;
export const slices = {
	players: playersSlice,
	enemies: enemiesSlice,
	fighterTarget: fighterTargetSlice,
	eggs: eggsSlice,
	store: storeSlice,
	dps: dpsSlice,
};

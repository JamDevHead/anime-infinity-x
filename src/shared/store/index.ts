import { CombineStates } from "@rbxts/reflex";
import { enemiesSlice } from "./enemies";
import { playersSlice } from "./players";
import { dpsSlice } from "@/shared/store/dps";
import { eggsSlice } from "@/shared/store/eggs";
import { fighterSpecialsSlice } from "@/shared/store/fighter-specials";
import { storeSlice } from "@/shared/store/store";

export type SharedState = CombineStates<typeof slices>;
export const slices = {
	players: playersSlice,
	enemies: enemiesSlice,
	eggs: eggsSlice,
	store: storeSlice,
	dps: dpsSlice,
	fighterSpecials: fighterSpecialsSlice,
};

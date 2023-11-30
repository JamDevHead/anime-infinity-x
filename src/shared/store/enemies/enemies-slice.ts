import { combineProducers } from "@rbxts/reflex";
import { dropsSlice } from "@/shared/store/enemies/drops";

export const enemiesSlice = combineProducers({
	drops: dropsSlice,
});

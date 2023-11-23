import { combineProducers } from "@rbxts/reflex";
import { healthSlice } from "@/shared/store/enemies/health";

export const enemiesSlice = combineProducers({
	health: healthSlice,
});

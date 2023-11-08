import { combineProducers } from "@rbxts/reflex";
import { healthSlice } from "@/shared/reflex/slices/enemies/health";

export const enemiesSlice = combineProducers({
	health: healthSlice,
});

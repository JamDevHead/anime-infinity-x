import { createSelector } from "@rbxts/reflex";
import { SharedState } from "@/shared/store";

export const selectDamagePerSecond = (state: SharedState) => state.dps;

export const selectPlayerDamagePerSecond = (playerId: string) => {
	return createSelector(selectDamagePerSecond, (dps) => {
		return dps[playerId];
	});
};

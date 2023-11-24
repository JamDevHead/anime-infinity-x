import { SharedState } from "@/shared/store";
import { createSelector } from "@rbxts/reflex";

export const selectSelectedEnemies = (state: SharedState) => {
	return state.enemySelection;
};

export const selectSelectedEnemiesByPlayerId = (playerId: string) => {
	return createSelector(selectSelectedEnemies, (enemies) => {
		return enemies[playerId] ?? [];
	});
};

import { createSelector, shallowEqual } from "@rbxts/reflex";
import { SharedState } from "@/shared/store";

export const selectSelectedEnemies = (state: SharedState) => {
	return state.enemySelection;
};

export const selectSelectedEnemiesByPlayerId = (playerId: string) => {
	return createSelector(
		selectSelectedEnemies,
		(enemies) => {
			return enemies[playerId];
		},
		{ resultEqualityCheck: shallowEqual },
	);
};

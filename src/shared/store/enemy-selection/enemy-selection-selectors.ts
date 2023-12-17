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

export const selectSelectedEnemyById = (playerId: string, id: string) => {
	return createSelector(selectSelectedEnemiesByPlayerId(playerId), (enemies) => {
		return enemies?.find((enemy) => enemy === id);
	});
};

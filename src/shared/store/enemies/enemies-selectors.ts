import { createSelector } from "@rbxts/reflex";
import { SharedState } from "@/shared/store";

export const selectEnemies = (state: SharedState) => state.enemies;

export const selectEnemiesDrops = (state: SharedState) => state.enemies.drops;

export const selectEnemyDrops = (enemyId: string) => {
	return createSelector(selectEnemiesDrops, (drops) => drops[enemyId]);
};

import { createSelector } from "@rbxts/reflex";
import { SharedState } from "@/shared/store";
import { Drop } from "@/shared/store/enemies/drops";

export const selectEnemies = (state: SharedState) => state.enemies;

export const selectEnemiesDrops = (state: SharedState) => state.enemies.drops;

const filterEnemiesDrops = (filter: (drop: Drop) => boolean) => {
	return createSelector(selectEnemiesDrops, (drops) => {
		return drops.filter(filter);
	});
};

export const selectEnemiesDropsByOwnerId = (ownerId: string) => {
	return filterEnemiesDrops((drop) => drop.owner === ownerId);
};

export const selectEnemyDrop = (dropId: string) => {
	return createSelector(
		filterEnemiesDrops((drop) => drop.id === dropId),
		(drops) => {
			return drops[0];
		},
	);
};

export const selectEnemyDrops = (enemyId: string) => {
	return filterEnemiesDrops((drop) => drop.enemyId === enemyId);
};

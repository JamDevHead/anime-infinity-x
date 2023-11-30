import { createSelector } from "@rbxts/reflex";
import { SharedState } from "@/shared/store";
import { Drop } from "@/shared/store/enemies/drops";

export const selectEnemiesDrops = (state: SharedState) => state.enemies.drops;

const filterEnemiesDrops = (filter: (drop: Drop) => boolean) => {
	return createSelector(selectEnemiesDrops, (drops) => {
		return drops.filter((drop) => filter(drop));
	});
};

export const selectEnemiesDropsByOwnerId = (ownerId: string) => {
	return createSelector(selectEnemiesDrops, (drops) => {
		return drops.filter((drop) => drop.owner === ownerId);
	});
};

export const selectEnemyDrop = (dropId: string) => {
	return createSelector(selectEnemiesDrops, (drops) => {
		return drops.find((drop) => drop.id === dropId);
	});
};

export const selectEnemyDrops = (enemyId: string) => {
	return filterEnemiesDrops((drop) => drop.enemyId === enemyId);
};

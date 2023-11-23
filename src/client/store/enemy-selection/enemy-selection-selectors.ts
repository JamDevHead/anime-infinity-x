import { RootState } from "@/client/store";

export const selectSelectedEnemies = (state: RootState) => {
	return state.enemySelection.enemies;
};

export const selectHoveredEnemy = (state: RootState) => {
	return state.enemySelection.hoveredEnemy;
};

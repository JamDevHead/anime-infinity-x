import { RootState } from "@/client/store";

export const selectSelectedEnemies = (state: RootState) => {
	return state.enemySelection.enemies;
};

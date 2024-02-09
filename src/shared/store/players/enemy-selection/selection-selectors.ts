import { SharedState } from "@/shared/store";

export const selectEnemySelectionFromPlayer = (playerId: string) => {
	return (state: SharedState) => {
		return state.players.enemySelection[playerId];
	};
};

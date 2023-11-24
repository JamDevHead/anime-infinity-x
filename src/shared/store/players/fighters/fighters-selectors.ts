import { createSelector } from "@rbxts/reflex";
import type { SharedState } from "@/shared/store";

export const selectPlayerFighters = (playerId: string) => {
	return (state: SharedState) => {
		return state.players.fighters[playerId];
	};
};

export const selectActivePlayerFighters = (playerId: string) => {
	return createSelector(selectPlayerFighters(playerId), (fighters) => {
		return fighters?.actives;
	});
};

export const selectActiveFighters = (state: SharedState) => {
	const activeFighters = {} as Record<string, string[]>;

	for (const [playerId, playerFighters] of pairs(state.players.fighters)) {
		activeFighters[playerId] = playerFighters?.actives ?? [];
	}

	return activeFighters;
};

import { SharedState } from "@/shared/reflex/slices";
import { createSelector } from "@rbxts/reflex";
import { PlayerData } from "@/shared/reflex/slices/players/types";

export const selectPlayerBalance = (playerId: string) => {
	return (state: SharedState) => {
		return state.players.balance[playerId];
	};
};

export const selectPlayerData = (playerId: string) => {
	return createSelector(selectPlayerBalance(playerId), (balance): PlayerData | undefined => {
		if (!balance) {
			return;
		}

		return { boosts: {}, fighters: {}, inventory: {}, missions: {}, settings: {}, balance };
	});
};

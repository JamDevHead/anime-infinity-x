import { SharedState } from "@/shared/reflex/slices";
import { createSelector } from "@rbxts/reflex";
import { PlayerData } from "@/shared/reflex/slices/players/types";

export const selectPlayerBalance = (playerId: string) => {
	return (state: SharedState) => {
		return state.players.balance[playerId];
	};
};

export const selectPlayerZones = (playerId: string) => {
	return (state: SharedState) => {
		return state.players.zones[playerId];
	};
};

export const selectPlayerData = (playerId: string) => {
	return createSelector(
		selectPlayerBalance(playerId),
		selectPlayerZones(playerId),
		(balance, zones): PlayerData | undefined => {
			if (!balance || !zones) {
				return;
			}

			return { boosts: {}, fighters: {}, inventory: {}, missions: {}, settings: {}, balance, zones };
		},
	);
};

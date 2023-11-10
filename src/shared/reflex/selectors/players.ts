import { createSelector } from "@rbxts/reflex";
import { SharedState } from "@/shared/reflex/slices";
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

export const selectPlayerFighters = (playerId: string) => {
	return (state: SharedState) => {
		return state.players.fighters[playerId];
	};
};

export const selectPlayerData = (playerId: string) => {
	return createSelector(
		selectPlayerBalance(playerId),
		selectPlayerZones(playerId),
		selectPlayerFighters(playerId),
		(balance, zones, fighters): PlayerData | undefined => {
			if (!balance || !zones || !fighters) {
				return;
			}

			return { boosts: {}, fighters, inventory: {}, missions: {}, settings: {}, balance, zones };
		},
	);
};

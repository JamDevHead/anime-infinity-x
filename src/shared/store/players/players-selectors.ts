import { createSelector } from "@rbxts/reflex";
import { SharedState } from "@/shared/store";
import { PlayerData } from "@/shared/store/players/players-types";
import { selectPlayerFighters } from "@/shared/store/players/fighters";

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

export const selectPlayerMissions = (playerId: string) => {
	return (state: SharedState) => {
		return state.players.missions[playerId];
	};
};

export const selectPlayerBoosts = (playerId: string) => {
	return (state: SharedState) => {
		return state.players.boosts[playerId];
	};
};

export const selectPlayerInventory = (playerId: string) => {
	return (state: SharedState) => {
		return state.players.inventory[playerId];
	};
};

export const selectPlayerData = (playerId: string) => {
	return createSelector(
		selectPlayerBalance(playerId),
		selectPlayerZones(playerId),
		selectPlayerFighters(playerId),
		selectPlayerMissions(playerId),
		selectPlayerBoosts(playerId),
		selectPlayerInventory(playerId),
		(balance, zones, fighters, missions, boosts, inventory): PlayerData | undefined => {
			if (!balance || !zones || !fighters || !missions || !boosts || !inventory) {
				return;
			}

			return { boosts, fighters, inventory, missions, settings: {}, balance, zones };
		},
	);
};

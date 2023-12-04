import { createSelector, shallowEqual } from "@rbxts/reflex";
import { SharedState } from "@/shared/store";
import { selectPlayerFighters } from "@/shared/store/players/fighters";
import { PlayerData } from "@/shared/store/players/players-types";

export const selectPlayersZones = (state: SharedState) => {
	return state.players.zones;
};

export const selectPlayerBalance = (playerId: string) => {
	return (state: SharedState) => {
		return state.players.balance[playerId];
	};
};

export const selectPlayerZones = (playerId: string) => {
	return createSelector(
		selectPlayersZones,
		(zones) => {
			return zones[playerId];
		},
		{ resultEqualityCheck: shallowEqual },
	);
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

export const selectPlayerInfo = (playerId: string) => {
	return (state: SharedState) => {
		return state.players.info[playerId];
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
		selectPlayerInfo(playerId),
		(balance, zones, fighters, missions, boosts, inventory, info): PlayerData | undefined => {
			if (!balance || !zones || !fighters || !missions || !boosts || !inventory || !info) {
				return;
			}

			return {
				boosts,
				fighters,
				inventory,
				missions,
				settings: {},
				balance,
				zones,
				info,
			};
		},
	);
};

import { createSelector } from "@rbxts/reflex";
import { SharedState } from "@/shared/store";

export const selectMissions = (state: SharedState) => state.players.missions;

export const selectPlayerMissions = (playerId: string) => {
	return createSelector(selectMissions, (playersMissions) => {
		return playersMissions[playerId];
	});
};

export const selectAllPlayerMissions = (playerId: string) => {
	return createSelector(selectPlayerMissions(playerId), (missions) => {
		return missions?.all ?? [];
	});
};

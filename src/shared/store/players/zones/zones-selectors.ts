import { createSelector, shallowEqual } from "@rbxts/reflex";
import { SharedState } from "@/shared/store";

export const selectPlayersZones = (state: SharedState) => {
	return state.players.zones;
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

export const selectPlayerCurrentZone = (playerId: string) => {
	return createSelector(selectPlayerZones(playerId), (zones) => {
		return zones?.current;
	});
};

import { createSelector, shallowEqual } from "@rbxts/reflex";
import { SharedState } from "@/shared/store";

export const selectPlayersSettings = (state: SharedState) => {
	return state.players.settings;
};

export const selectPlayerSettings = (playerId: string) => {
	return (state: SharedState) => {
		return state.players.settings[playerId];
	};
};

export const selectPlayerSettingsEquality = createSelector(
	selectPlayerSettings,
	(settings) => {
		return settings;
	},
	{ resultEqualityCheck: shallowEqual },
);

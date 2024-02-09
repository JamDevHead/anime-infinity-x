import { createProducer } from "@rbxts/reflex";
import { Setting } from "@/@types/models/setting";
import { PlayerData } from "@/shared/store/players/players-types";

export type SettingsState = {
	readonly [playerId: string]: Record<string, Setting> | undefined;
};

const initialState: SettingsState = {};

export const settingsSlice = createProducer(initialState, {
	loadPlayerData: (state, playerId: string, data: PlayerData) => ({
		...state,
		[playerId]: data.settings,
	}),

	unloadPlayerData: (state, playerId: string) => ({
		...state,
		[playerId]: undefined,
	}),

	setSettings: (state, playerId: string, settings: Record<string, Setting>) => ({
		...state,
		[playerId]: settings,
	}),
});

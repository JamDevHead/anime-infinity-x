import { createProducer } from "@rbxts/reflex";
import { Setting } from "@/@types/models/setting";

type SettingsState = {
	localSettings: Record<string, Setting>;
};

const initialState: SettingsState = {
	localSettings: {},
};

export const clientSettingsSlice = createProducer(initialState, {
	setClientSetting: (state, { key, value }: { key: string; value: number | boolean }) => ({
		...state,
		localSettings: {
			...state.localSettings,
			[key]: {
				...state.localSettings[key],
				value,
			},
		},
	}),

	setClientSettings: (state, settings: SettingsState["localSettings"]) => ({
		...state,
		localSettings: {
			...state.localSettings,
			...settings,
		},
	}),

	loadServerSettings: (state, settings: SettingsState["localSettings"]) => ({
		...state,
		localSettings: settings,
	}),
});

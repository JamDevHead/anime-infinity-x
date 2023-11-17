import { createProducer } from "@rbxts/reflex";
import { DefaultSettings, transformSettingsToPacket } from "@/client/constants/default-settings";

type SettingsState = {
	settings: Record<string, boolean | number>;
};

const initialState: SettingsState = {
	settings: transformSettingsToPacket(DefaultSettings),
};

export const settingsSlice = createProducer(initialState, {
	setSetting: (state, { key, value }: { key: string; value: boolean | number }) => ({
		...state,
		settings: {
			...state.settings,
			[key]: value,
		},
	}),

	setSettings: (state, settings: SettingsState["settings"]) => ({
		...state,
		settings: {
			...state.settings,
			...settings,
		},
	}),
});

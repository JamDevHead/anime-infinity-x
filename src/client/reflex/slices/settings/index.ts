import { createProducer } from "@rbxts/reflex";
import { Settings } from "@/@types/models/setting";

type SettingsState = {
	settings: Settings;
};

const initialState: SettingsState = {
	settings: {
		music: {
			label: "Toggle Music",
			value: false,
		},
		shadow: {
			label: "Toggle Shadow",
			value: false,
		},
	},
};

export const settingsSlice = createProducer(initialState, {
	setSetting: (state, key: typeof initialState.settings, value: boolean | number) => ({
		...state,
		settings: {
			...state.settings,
			[key as unknown as keyof Settings]: {
				...state.settings[key as unknown as keyof Settings],
				value,
			},
		},
	}),
});

import { createSelector, shallowEqual } from "@rbxts/reflex";
import { RootState } from "@/client/store";

export const selectClientSettings = (state: RootState) => state.clientSettings.localSettings;

export const selectClientSetting = (setting: string) => {
	return createSelector(selectClientSettings, (settings) => {
		return settings[setting];
	});
};

export const selectClientSettingsPacket = createSelector(
	selectClientSettings,
	(settings) => {
		return settings;
	},
	{ resultEqualityCheck: shallowEqual },
);

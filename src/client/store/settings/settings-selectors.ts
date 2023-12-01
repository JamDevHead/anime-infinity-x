import { createSelector } from "@rbxts/reflex";
import { RootState } from "@/client/store";

export const selectSettings = (state: RootState) => state.settings.settings;

export const selectSetting = (setting: string) => {
	return createSelector(selectSettings, (settings) => {
		return settings[setting];
	});
};

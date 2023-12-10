import { createSelector } from "@rbxts/reflex";
import { RootState } from "@/client/store";

export const selectPerks = (state: RootState) => state.perks;

export const selectSpecificPerk = (perk: keyof RootState["perks"]) => {
	return createSelector(selectPerks, (perks) => perks[perk]);
};

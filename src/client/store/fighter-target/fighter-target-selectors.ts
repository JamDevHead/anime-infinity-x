import { RootState } from "@/client/store";
import { createSelector } from "@rbxts/reflex";

export const selectFightersTarget = (state: RootState) => state.fighterTarget.fighters;

export const selectFighterTarget = (fighterUid: string) => {
	return createSelector(selectFightersTarget, (fighters) => {
		return fighters[fighterUid];
	});
};

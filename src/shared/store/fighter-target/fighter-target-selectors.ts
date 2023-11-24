import { createSelector } from "@rbxts/reflex";
import { SharedState } from "@/shared/store";

export const selectFightersTarget = (state: SharedState) => state.fighterTarget;

export const selectFighterTarget = (fighterUid: string) => {
	return createSelector(selectFightersTarget, (fighters) => {
		return fighters[fighterUid];
	});
};

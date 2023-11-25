import { createSelector } from "@rbxts/reflex";
import { SharedState } from "@/shared/store";

export const selectFightersTarget = (state: SharedState) => state.fighterTarget;

export const selectFighterTarget = (fighterUid: string) => {
	return createSelector(selectFightersTarget, (fighters) => {
		return fighters[fighterUid];
	});
};

export const selectFighterWithTarget = (targetUid: string) => {
	return createSelector(selectFightersTarget, (fighters) => {
		const fighterUids = [] as string[];

		for (const [fighterUid, target] of pairs(fighters)) {
			if (target === targetUid) {
				fighterUids.push(fighterUid as string);
			}
		}

		return fighterUids;
	});
};

import { createSelector } from "@rbxts/reflex";
import { SharedState } from "@/shared/store";
import { selectPlayerFighters } from "@/shared/store/players/fighters";

export const selectFightersTarget = (state: SharedState) => state.fighterTarget;

export const selectFighterTarget = (fighterUid: string) => {
	return createSelector(selectFightersTarget, (fighters) => {
		return fighters[fighterUid];
	});
};

export const selectPlayerFightersTarget = (playerId: string) => {
	return createSelector(selectFightersTarget, selectPlayerFighters(playerId), (fightersTarget, playerFighters) => {
		if (!playerFighters) {
			return [] as string[];
		}

		const fighterUids = [] as string[];

		for (const [, playerFighter] of pairs(playerFighters.all)) {
			if (fightersTarget[playerFighter.uid] !== undefined) {
				fighterUids.push(playerFighter.uid);
			}
		}

		return fighterUids;
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

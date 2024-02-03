import { createSelector, shallowEqual } from "@rbxts/reflex";
import type { SharedState } from "@/shared/store";

export const selectPlayersFighters = (state: SharedState) => {
	return state.players.fighters;
};

export const selectPlayerFighters = (playerId: string) => {
	return createSelector(selectPlayersFighters, (fighters) => {
		return fighters[playerId];
	});
};

export const selectAllPlayerFighters = (playerId: string) => {
	return createSelector(
		selectPlayerFighters(playerId),
		(fighters) => {
			return fighters?.all ?? [];
		},
		{ resultEqualityCheck: shallowEqual },
	);
};

export const selectPlayerFighter = (playerId: string, fighterUid: string) => {
	return createSelector(selectPlayerFighters(playerId), (fighters) => {
		return fighters?.all.find((fighter) => fighter.uid === fighterUid);
	});
};

export const selectPlayersFightersWithUid = (fighterUid: string) => {
	return createSelector(selectPlayersFighters, (fighters) => {
		for (const [_, playerFighters] of pairs(fighters)) {
			const fighter = playerFighters?.all.find((fighter) => fighter.uid === fighterUid);

			if (fighter) {
				return fighter;
			}
		}
	});
};

export const selectActivePlayerFighters = (playerId: string) => {
	return createSelector(
		selectPlayerFighters(playerId),
		(fighters) => {
			return fighters?.actives ?? [];
		},
		{ resultEqualityCheck: shallowEqual },
	);
};

/** **WARNING**
 * This is a very expensive selector, use it only when needed.
 */
export const selectPlayerFromFighterId = (fighterUid: string) => {
	return createSelector(selectPlayersFighters, (fighters) => {
		for (const [playerId, playerFighters] of pairs(fighters)) {
			const fighter = playerFighters?.all.find((fighter) => fighter.uid === fighterUid);

			if (fighter) {
				return playerId as string;
			}
		}
	});
};

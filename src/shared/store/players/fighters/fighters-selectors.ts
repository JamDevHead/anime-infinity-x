import { createSelector } from "@rbxts/reflex";
import type { SharedState } from "@/shared/store";
import { ActivePlayerFighter } from "@/shared/store/players";

const selectPlayersFighters = (state: SharedState) => {
	return state.players.fighters;
};

export const identifyActiveFighter = (fighter: ActivePlayerFighter) => {
	return fighter.fighterId;
};

export const selectPlayerFighters = (playerId: string) => {
	return createSelector(selectPlayersFighters, (fighters) => {
		return fighters[playerId];
	});
};

export const selectActiveFightersFromPlayer = (playerId: string) => {
	return (state: SharedState) => {
		return state.players.fighters[playerId]?.actives;
	};
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

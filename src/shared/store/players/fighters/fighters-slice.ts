import { createProducer } from "@rbxts/reflex";
import { PlayerData, PlayerFighter, PlayerFighters } from "@/shared/store/players/players-types";
import { assign, mapProperty } from "@/shared/utils/object-utils";

export interface FighterState {
	readonly [playerId: string]: PlayerFighters | undefined;
}

const initialState: FighterState = {};

export const fightersSlice = createProducer(initialState, {
	loadPlayerData: (state, playerId, data: PlayerData) => ({
		...state,
		[playerId]: data.fighters,
	}),

	unloadPlayerData: (state, playerId) => ({
		...state,
		[playerId]: undefined,
	}),

	addFighter: (state, playerId: string, fighterId: string, playerFighterData: Omit<PlayerFighter, "uid">) => {
		return mapProperty(state, playerId, (playerFighter) => ({
			...playerFighter,
			all: assign(playerFighter.all, { [fighterId]: { uid: fighterId, ...playerFighterData } }),
		}));
	},

	removeFighter: (state, playerId: string, fighterId: string) => {
		return mapProperty(state, playerId, (fighters) => ({
			...fighters,
			all: mapProperty(fighters.all, fighterId, () => undefined),
			actives: fighters.actives.filter((fighter) => fighter.fighterId !== fighterId),
		}));
	},

	addActiveFighter: (state, playerId: string, fighterId: string) => {
		return mapProperty(state, playerId, (fighters) => {
			const fighterData = fighters.all[fighterId];

			if (!fighterData) {
				return fighters;
			}

			return {
				...fighters,
				actives: [...fighters.actives, { characterId: fighterData.characterUid, fighterId }],
			};
		});
	},

	removeActiveFighter: (state, playerId: string, fighterId: string) => {
		return mapProperty(state, playerId, (fighters) => ({
			...fighters,
			actives: fighters.actives.filter((fighter) => fighter.fighterId !== fighterId),
		}));
	},

	renameDisplayName: (state, playerId: string, fighterId: string, displayName: string) => {
		return mapProperty(state, playerId, (fighters) => ({
			...fighters,
			all: mapProperty(fighters.all, fighterId, (fighter) => ({ ...fighter, displayName })),
		}));
	},
});

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

	setFighterStat: <T extends keyof PlayerFighter["stats"]>(
		state: FighterState,
		playerId: string,
		fighterId: string,
		name: T,
		value: PlayerFighter["stats"][T],
	) => {
		return mapProperty(state, playerId, (fighters) => ({
			...fighters,
			all: mapProperty(fighters.all, fighterId, (fighter) => ({
				...fighter,
				stats: { ...fighter.stats, [name]: value },
			})),
		}));
	},

	setFighterProperty: <T extends keyof PlayerFighter>(
		state: FighterState,
		playerId: string,
		fighterId: string,
		name: T,
		value: PlayerFighter[T],
	) => {
		return mapProperty(state, playerId, (fighters) => ({
			...fighters,
			all: mapProperty(fighters.all, fighterId, (fighter) => ({ ...fighter, [name]: value })),
		}));
	},
});

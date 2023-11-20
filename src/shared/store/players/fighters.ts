import { createProducer } from "@rbxts/reflex";
import { PlayerData, PlayerFighter, PlayerFighters } from "@/shared/store/players/players-types";

interface FighterState {
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

	addFighter: (state, playerId: string, fighterUid: string, playerFighterData: Omit<PlayerFighter, "uid">) => {
		const playerData = state[playerId];

		if (!playerData) {
			return state;
		}

		return {
			...state,
			[playerId]: {
				all: [...playerData.all, { uid: fighterUid, ...playerFighterData }],
				actives: playerData.actives,
			},
		};
	},

	removeFighter: (state, playerId: string, fighterUid: string) => {
		const playerData = state[playerId];

		if (!playerData) {
			return state;
		}

		return {
			...state,
			[playerId]: {
				all: playerData.all.filter((fighter) => fighter.uid !== fighterUid),
				actives: playerData.actives.filter((uid) => uid !== fighterUid),
			},
		};
	},

	addActiveFighter: (state, playerId: string, fighterUid: string) => {
		const playerData = state[playerId];

		if (!playerData) {
			return state;
		}

		return {
			...state,
			[playerId]: {
				all: playerData.all,
				actives: [...playerData.actives, fighterUid],
			},
		};
	},

	removeActiveFighter: (state, playerId: string, fighterUid: string) => {
		const playerData = state[playerId];

		if (!playerData) {
			return state;
		}

		return {
			...state,
			[playerId]: {
				all: playerData.all,
				actives: playerData.actives.filter((uid) => uid !== fighterUid),
			},
		};
	},
});

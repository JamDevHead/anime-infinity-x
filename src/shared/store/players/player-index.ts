import { createProducer } from "@rbxts/reflex";
import { PlayerData, PlayerIndex } from "@/shared/store/players/players-types";

export interface IndexState {
	readonly [playerId: string]: PlayerIndex | undefined;
}

const initialState: IndexState = {};

export const indexSlice = createProducer(initialState, {
	loadPlayerData: (state, playerId: string, data: PlayerData) => ({
		...state,
		[playerId]: data.index,
	}),

	unloadPlayerData: (state, playerId: string) => ({
		...state,
		[playerId]: undefined,
	}),

	addDiscoveredFighter: (state, playerId: string, fighterUid: string) => {
		const index = state[playerId];
		if (!index) return state;

		return {
			...state,
			[playerId]: {
				...index,
				discovered: [...index.discovered, fighterUid],
			},
		};
	},
});

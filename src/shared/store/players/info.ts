import { createProducer } from "@rbxts/reflex";
import { PlayerData, PlayerInfo } from "@/shared/store/players/players-types";

export interface InfoState {
	readonly [playerId: string]: PlayerInfo | undefined;
}

const initialState: InfoState = {};

export const infoSlice = createProducer(initialState, {
	loadPlayerData: (state, playerId: string, data: PlayerData) => ({
		...state,
		[playerId]: data.info,
	}),

	unloadPlayerData: (state, playerId: string) => ({
		...state,
		[playerId]: undefined,
	}),
	setFirstTime: (state, playerId: string, firstTime: boolean) => {
		const playerInfo = state[playerId];

		if (!playerInfo) {
			return state;
		}

		return {
			...state,
			[playerId]: {
				...playerInfo,
				firstTime: firstTime,
			},
		};
	},
});

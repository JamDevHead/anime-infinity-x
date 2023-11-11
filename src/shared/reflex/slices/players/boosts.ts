import { createProducer } from "@rbxts/reflex";
import { PlayerBoosts, PlayerData } from "@/shared/reflex/slices/players/types";

export interface MissionsState {
	readonly [playerId: string]: PlayerBoosts | undefined;
}

const initialState: MissionsState = {};

export const boostsSlice = createProducer(initialState, {
	loadPlayerData: (state, playerId: string, data: PlayerData) => ({
		...state,
		[playerId]: data.boosts,
	}),

	unloadPlayerData: (state, playerId: string) => ({
		...state,
		[playerId]: undefined,
	}),
});

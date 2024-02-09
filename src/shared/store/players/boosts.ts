import { createProducer } from "@rbxts/reflex";
import { PlayerBoosts, PlayerData } from "@/shared/store/players/players-types";

export interface BoostsState {
	readonly [playerId: string]: PlayerBoosts | undefined;
}

const initialState: BoostsState = {};

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

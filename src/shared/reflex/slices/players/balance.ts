import { PlayerBalance, PlayerData } from "@/shared/reflex/slices/players/types";
import { createProducer } from "@rbxts/reflex";

export interface BalanceState {
	readonly [playerId: string]: PlayerBalance | undefined;
}

const initialState: BalanceState = {};

export const balanceSlice = createProducer(initialState, {
	loadPlayerData: (state, playerId: string, data: PlayerData) => ({
		...state,
		[playerId]: data.balance,
	}),

	unloadPlayerData: (state, playerId: string) => ({
		...state,
		[playerId]: undefined,
	}),
});

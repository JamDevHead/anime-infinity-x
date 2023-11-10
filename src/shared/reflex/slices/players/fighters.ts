import { createProducer } from "@rbxts/reflex";
import { PlayerData, PlayerFighters } from "@/shared/reflex/slices/players/types";

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
});

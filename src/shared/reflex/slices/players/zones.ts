import { PlayerData, PlayerZones } from "@/shared/reflex/slices/players/types";
import { createProducer } from "@rbxts/reflex";

export interface ZonesState {
	readonly [playerId: string]: PlayerZones | undefined;
}

const initialState: ZonesState = {};

export const zonesSlice = createProducer(initialState, {
	loadPlayerData: (state, playerId: string, data: PlayerData) => ({
		...state,
		[playerId]: data.zones,
	}),

	unloadPlayerData: (state, playerId: string) => ({
		...state,
		[playerId]: undefined,
	}),
});

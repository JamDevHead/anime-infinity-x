import { createProducer } from "@rbxts/reflex";
import { PlayerData, PlayerMission } from "@/shared/store/players/players-types";

export interface MissionsState {
	readonly [playerId: string]: PlayerMission | undefined;
}

const initialState: MissionsState = {};

export const missionsSlice = createProducer(initialState, {
	loadPlayerData: (state, playerId: string, data: PlayerData) => ({
		...state,
		[playerId]: data.missions,
	}),

	unloadPlayerData: (state, playerId: string) => ({
		...state,
		[playerId]: undefined,
	}),
});

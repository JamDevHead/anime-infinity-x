import { createProducer } from "@rbxts/reflex";
import { Mission } from "@/shared/store/players/missions/missions-types";
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

	addMission: (state, playerId: string, mission: Mission) => {
		const playerMissions = state[playerId];

		if (!playerMissions) {
			return state;
		}

		return {
			...state,
			[playerId]: {
				all: [...playerMissions.all, mission],
				active: playerMissions.active,
			},
		};
	},

	removeMission: (state, playerId: string, missionId: Mission["id"]) => {
		const playerMissions = state[playerId];

		if (!playerMissions) {
			return state;
		}

		return {
			...state,
			[playerId]: {
				all: playerMissions.all.filter((mission) => mission.id !== missionId),
				active: playerMissions.active?.id === missionId ? undefined : playerMissions.active,
			},
		};
	},
});

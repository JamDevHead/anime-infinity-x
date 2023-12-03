import { createProducer } from "@rbxts/reflex";
import { Mission, Task } from "@/shared/store/players/missions/missions-types";
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
				...playerMissions,
				all: [...playerMissions.all, mission],
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
				active: playerMissions.active === missionId ? undefined : playerMissions.active,
			},
		};
	},

	clearMissions: (state, playerId: string) => ({
		...state,
		[playerId]: {
			all: [],
			active: undefined,
		},
	}),

	addTask: (state, playerId: string, missionId: Mission["id"], task: Task) => {
		const playerMissions = state[playerId];

		if (!playerMissions || playerMissions.all.find((mission) => mission.id === missionId)) {
			return state;
		}

		return {
			...state,
			[playerId]: {
				...playerMissions,
				all: playerMissions.all.map((mission) => {
					if (mission.id === missionId) {
						return {
							...mission,
							tasks: [...mission.tasks, task],
						};
					}

					return mission;
				}),
			},
		};
	},

	removeTask: (state, playerId: string, missionId: Mission["id"], taskId: Task["id"]) => {
		const playerMissions = state[playerId];

		if (!playerMissions || !playerMissions.all.find((mission) => mission.id === missionId)) {
			return state;
		}

		return {
			...state,
			[playerId]: {
				...playerMissions,
				all: playerMissions.all.map((mission) => {
					if (mission.id === missionId) {
						return {
							...mission,
							tasks: mission.tasks.filter((task) => task.id !== taskId),
						};
					}

					return mission;
				}),
			},
		};
	},
});

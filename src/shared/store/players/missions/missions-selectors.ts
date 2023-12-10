import { createSelector } from "@rbxts/reflex";
import { SharedState } from "@/shared/store";

export const selectMissions = (state: SharedState) => state.players.missions;

export const selectPlayerMissions = (playerId: string) => {
	return createSelector(selectMissions, (playersMissions) => {
		return playersMissions[playerId];
	});
};

export const selectAllPlayerMissions = (playerId: string) => {
	return createSelector(selectPlayerMissions(playerId), (missions) => {
		return missions?.all;
	});
};

export const selectPlayerMission = (playerId: string, missionId: string) => {
	return createSelector(selectAllPlayerMissions(playerId), (missions) => {
		return missions?.find((mission) => mission.id === missionId);
	});
};

export const selectPlayerMissionWithTaskId = (playerId: string, taskId: string) => {
	return createSelector(selectAllPlayerMissions(playerId), (missions) => {
		return missions?.find((mission) => mission.tasks.some((task) => task.id === taskId));
	});
};

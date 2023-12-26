import { FilterState } from "@/server/store/filters/filter";

export const filterMissions: FilterState = (player, state) => {
	const userId = tostring(player.UserId);

	return {
		...state,
		players: {
			...state.players,
			missions: {
				[userId]: state.players.missions[userId],
			},
		},
	};
};

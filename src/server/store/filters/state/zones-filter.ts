import { FilterState } from "@/server/store/filters/filter";

export const filterZones: FilterState = (player, state) => {
	const userId = tostring(player.UserId);

	return {
		...state,
		players: {
			...state.players,
			zones: {
				[userId]: state.players.zones[userId],
			},
		},
	};
};

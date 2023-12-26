import { FilterState } from "@/server/store/filters/filter";

export const filterSettings: FilterState = (player, state) => {
	const userId = tostring(player.UserId);

	return {
		...state,
		players: {
			...state.players,
			settings: {
				[userId]: state.players.settings[userId],
			},
		},
	};
};

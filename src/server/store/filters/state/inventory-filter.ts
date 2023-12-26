import { FilterState } from "@/server/store/filters/filter";

export const filterInventory: FilterState = (player, state) => {
	const userId = tostring(player.UserId);

	return {
		...state,
		players: {
			...state.players,
			inventory: {
				[userId]: state.players.inventory[userId],
			},
		},
	};
};

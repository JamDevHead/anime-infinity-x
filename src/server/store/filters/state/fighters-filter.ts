import { Filter } from "@/server/store/filters/filter";
import { FighterState } from "@/shared/store/players/fighters";

export const filterFighters: Filter<FighterState> = (player, state) => {
	const userId = tostring(player.UserId);
	const fighters = state[userId];

	return {
		[userId]: fighters
			? {
					actives: fighters.actives,
					all: [],
			  }
			: undefined,
	};
};

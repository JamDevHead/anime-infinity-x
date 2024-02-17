import { t } from "@rbxts/t";
import { Filter } from "@/server/store/filters/filter";
import { FighterState } from "@/shared/store/players/fighters";

export const filterFighters: Filter<FighterState> = (player, state) => {
	const userId = tostring(player.UserId);
	const fighters = state[userId];
	const otherPlayersFighters: { [playerId: string]: typeof fighters } = {};

	for (const [playerId, fighters] of pairs(state)) {
		if (!t.string(playerId) || playerId === userId) {
			continue;
		}

		otherPlayersFighters[playerId] = {
			...fighters,
			all: {},
		};
	}

	return {
		...otherPlayersFighters,
		[userId]: fighters,
	};
};

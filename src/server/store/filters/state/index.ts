import { Filter, FilterState } from "@/server/store/filters/filter";
import { filterPlayers } from "@/server/store/filters/state/players-filter";

export const stateFilters: FilterState[] = [filterPlayers];

export function simpleFilter<T extends { [key: string]: unknown }>() {
	return ((player, state) => {
		const userId = tostring(player.UserId);

		return {
			[userId]: state[userId],
		};
	}) as Filter<T>;
}

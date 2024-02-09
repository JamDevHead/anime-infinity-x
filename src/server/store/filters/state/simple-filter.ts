import { Filter } from "@/server/store/filters/filter";

export function simpleFilter<T extends { [key: string]: unknown }>() {
	return ((player, state) => {
		const userId = tostring(player.UserId);

		return {
			[userId]: state[userId],
		};
	}) as Filter<T>;
}

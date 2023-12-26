import { BroadcastAction } from "@rbxts/reflex";
import { RootState } from "@/server/store";

export type Filter<T> = (player: Player, toFilter: T) => T;
export type FilterState = Filter<RootState>;
export type FilterAction = Filter<BroadcastAction | undefined>;

export function filter<T extends (BroadcastAction | undefined) | RootState>(
	player: Player,
	toFilter: T,
	filters: Filter<T>[],
): T {
	let newToFilter = toFilter;

	for (const filterFn of filters) {
		newToFilter = filterFn(player, newToFilter);

		if (!newToFilter) {
			break;
		}
	}

	return newToFilter;
}

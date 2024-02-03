import { BroadcastAction } from "@rbxts/reflex";
import { RootState } from "@/server/store";
import { actionFilters } from "@/server/store/filters/actions";
import { stateFilters } from "@/server/store/filters/state/state-filters";

export type Filter<T> = (player: Player, toFilter: T) => T;
export type FilterState = Filter<RootState>;
export type FilterAction = Filter<BroadcastAction | undefined>;

// Filters data on hydrate calls
export function filterState(player: Player, stateToSend: RootState): RootState {
	let newState = stateToSend;

	for (const filter of stateFilters) {
		newState = filter(player, newState);
	}

	return newState;
}

// Filters actions on dispatch calls
export function filterAction(player: Player, actionToSend: BroadcastAction | undefined) {
	let newAction = actionToSend;

	for (const filter of actionFilters) {
		if (!newAction) {
			break;
		}

		newAction = filter(player, newAction);
	}

	return newAction;
}

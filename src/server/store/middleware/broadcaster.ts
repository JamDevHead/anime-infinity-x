import { createBroadcaster, ProducerMiddleware } from "@rbxts/reflex";
import { actionFilters } from "@/server/store/filters/actions";
import { filter } from "@/server/store/filters/filter";
import { stateFilters } from "@/server/store/filters/state";
import remotes from "@/shared/remotes";
import { slices } from "@/shared/store";

export function broadcasterMiddleware(): ProducerMiddleware {
	const broadcaster = createBroadcaster({
		producers: slices,
		hydrateRate: 60,
		beforeDispatch: (player, action) => {
			return filter(player, action, actionFilters);
		},
		beforeHydrate: (player, state) => {
			return filter(player, state, stateFilters);
		},
		dispatch: (player, actions) => {
			remotes.store.dispatch.fire(player, actions);
		},
		hydrate: (player, state) => {
			remotes.store.hydrate.fire(player, state);
		},
	});

	remotes.store.start.connect((player) => {
		broadcaster.start(player);
	});

	return broadcaster.middleware;
}

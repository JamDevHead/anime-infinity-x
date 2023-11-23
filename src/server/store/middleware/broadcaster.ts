import { createBroadcaster, ProducerMiddleware } from "@rbxts/reflex";
import remotes from "@/shared/remotes";
import { slices } from "@/shared/store";

export function broadcasterMiddleware(): ProducerMiddleware {
	const broadcaster = createBroadcaster({
		producers: slices,
		hydrateRate: 60,
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

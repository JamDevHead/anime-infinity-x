import { createBroadcaster, ProducerMiddleware } from "@rbxts/reflex";
import remotes from "@/shared/remotes";
import { slices } from "@/shared/store";

export function broadcasterMiddleware(): ProducerMiddleware {
	const reflexNamespace = remotes.Server.GetNamespace("reflex");
	const startRemote = reflexNamespace.Get("start");
	const dispatchRemote = reflexNamespace.Get("dispatch");
	const hydrateRemote = reflexNamespace.Get("hydrate");

	const broadcaster = createBroadcaster({
		producers: slices,
		hydrateRate: 60,
		dispatch: (player, actions) => {
			dispatchRemote.SendToPlayer(player, actions);
		},
		hydrate: (player, state) => {
			hydrateRemote.SendToPlayer(player, state);
		},
	});

	startRemote.Connect((player) => {
		broadcaster.start(player);
	});

	return broadcaster.middleware;
}

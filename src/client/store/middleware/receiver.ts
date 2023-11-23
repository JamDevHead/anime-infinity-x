import { createBroadcastReceiver, ProducerMiddleware } from "@rbxts/reflex";
import { RootStore } from "@/client/store";
import { devToolsMiddleware } from "@/client/store/middleware/devtools";
import remotes from "@/shared/remotes";

export function receiverMiddleware(producer: RootStore): ProducerMiddleware {
	const receiver = createBroadcastReceiver({
		start: () => remotes.store.start.fire(),
	});

	remotes.store.dispatch.connect((actions) => {
		receiver.dispatch(actions);
	});

	remotes.store.hydrate.connect((state) => {
		receiver.hydrate(state);
		devToolsMiddleware(producer)(() => state, "__hydrate__")();
	});

	return receiver.middleware;
}

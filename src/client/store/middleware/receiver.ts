import { createBroadcastReceiver, ProducerMiddleware } from "@rbxts/reflex";
import { RootStore } from "@/client/store";
import { devToolsMiddleware } from "@/client/store/middleware/devtools";
import Remotes from "@/shared/remotes";

export function receiverMiddleware(producer: RootStore): ProducerMiddleware {
	const reflexNamespace = Remotes.Client.GetNamespace("reflex");
	const startRemote = reflexNamespace.Get("start");
	const dispatchRemote = reflexNamespace.Get("dispatch");
	const hydrateRemote = reflexNamespace.Get("hydrate");

	const receiver = createBroadcastReceiver({
		start: () => startRemote.SendToServer(),
	});

	dispatchRemote.Connect((actions) => {
		receiver.dispatch(actions);
	});

	hydrateRemote.Connect((state) => {
		receiver.hydrate(state);
		devToolsMiddleware(producer)(() => state, "__hydrate__")();
	});

	return receiver.middleware;
}

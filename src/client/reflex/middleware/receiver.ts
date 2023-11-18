import { createBroadcastReceiver, ProducerMiddleware } from "@rbxts/reflex";
import { devToolsMiddleware } from "@/client/reflex/middleware/devtools";
import { RootProducer } from "@/client/reflex/producers";
import Remotes from "@/shared/remotes";

export function receiverMiddleware(producer: RootProducer): ProducerMiddleware {
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

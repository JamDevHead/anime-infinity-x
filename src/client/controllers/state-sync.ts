import { Controller, OnStart } from "@flamework/core";
import { createBroadcastReceiver } from "@rbxts/reflex";
import { producer } from "client/reflex/producers";
import Remotes from "shared/remotes";

@Controller()
export default class StateSync implements OnStart {
	private reflexNamespace = Remotes.Client.GetNamespace("reflex");
	private receiver = createBroadcastReceiver({
		start: () => this.reflexNamespace.Get("start").SendToServer(),
	});

	onStart(): void | Promise<void> {
		this.reflexNamespace.Get("dispatch").Connect((actions) => this.receiver.dispatch(actions));

		producer.applyMiddleware(this.receiver.middleware);
	}
}

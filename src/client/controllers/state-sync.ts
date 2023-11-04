import { Controller, OnStart } from "@flamework/core";
import { createBroadcastReceiver } from "@rbxts/reflex";
import { producer } from "client/reflex/producers";
import Remotes from "shared/remotes";
import { Logger } from "@rbxts/log";

@Controller()
export default class StateSync implements OnStart {
	private reflexNamespace = Remotes.Client.GetNamespace("reflex");
	private receiver = createBroadcastReceiver({
		start: () => {
			this.logger.Info("Client Reflex state sync started");
			this.reflexNamespace.Get("start").SendToServer();
		},
	});

	constructor(private logger: Logger) {}

	onStart(): void | Promise<void> {
		this.reflexNamespace.Get("dispatch").Connect((actions) => {
			this.logger.Debug("Received reflex actions: {@actions}", actions);
			this.receiver.dispatch(actions);
		});

		producer.applyMiddleware(this.receiver.middleware);
	}
}

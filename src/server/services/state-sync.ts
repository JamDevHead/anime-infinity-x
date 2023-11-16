import { OnStart, Service } from "@flamework/core";
import { Logger } from "@rbxts/log";
import { createBroadcaster } from "@rbxts/reflex";
import { producer } from "server/reflex/producers";
import { slices } from "shared/reflex/slices";
import Remotes from "shared/remotes";

@Service()
export default class StateSync implements OnStart {
	constructor(private logger: Logger) {}

	onStart() {
		const reflexNamespace = Remotes.Server.GetNamespace("reflex");
		const dispatchRemote = reflexNamespace.Get("dispatch");
		const startRemote = reflexNamespace.Get("start");

		const broadcaster = createBroadcaster({
			producers: slices,
			dispatch: (player, actions) => {
				print("Dispatching reflex actions:", actions);
				dispatchRemote.SendToPlayer(player, actions);
			},
		});

		startRemote.Connect((player) => {
			this.logger.Info("Server Reflex state sync started");
			broadcaster.start(player);
		});
		producer.applyMiddleware(broadcaster.middleware);
	}
}

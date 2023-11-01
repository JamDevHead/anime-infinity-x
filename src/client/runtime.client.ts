import Log, { Logger } from "@rbxts/log";
import Zircon from "@rbxts/zircon";
import { Flamework, Modding } from "@flamework/core";

Log.SetLogger(
	Logger.configure()
		.WriteTo(Log.RobloxOutput())
		.WriteTo(Zircon.Log.Console())
		.EnrichWithProperty("Source", "Client")
		.Create(),
);

Modding.registerDependency<Logger>((actor) => {
	return Log.ForContext(actor); // will register this under the given DI class
});

Flamework.addPaths("src/client/components");
Flamework.addPaths("src/client/controllers");
Flamework.addPaths("src/shared/components");

Flamework.ignite();

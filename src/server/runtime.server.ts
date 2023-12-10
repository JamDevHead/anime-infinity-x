import { Flamework, Modding } from "@flamework/core";
import Log, { Logger } from "@rbxts/log";
import Zircon from "@rbxts/zircon";

Log.SetLogger(
	Logger.configure()
		.WriteTo(Log.RobloxOutput())
		.WriteTo(Zircon.Log.Console())
		.EnrichWithProperty("Source", "Server")
		.Create(),
);

Modding.registerDependency<Logger>((actor) => {
	return Log.ForContext(actor); // will register this under the given DI class
});

Flamework.addPaths("src/server/components");
Flamework.addPaths("src/server/services");
Flamework.addPaths("src/server/missions");
Flamework.addPaths("src/shared/components");

Flamework.ignite();

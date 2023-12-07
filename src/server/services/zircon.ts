import { OnInit, Service } from "@flamework/core";
import { Logger } from "@rbxts/log";
import { ZirconServer } from "@rbxts/zircon";
import { ZirconNamespace } from "@rbxts/zircon/out/Class/ZirconNamespace";
import { balanceCommands } from "@/server/commands/balance";
import { giveCommand } from "@/server/commands/give";
import { zoneCommands } from "@/server/commands/zone";
import { ZirconServerConfig } from "@/server/constants/zircon-server-config";

@Service({})
export class Zircon implements OnInit {
	constructor(private logger: Logger) {}

	onInit(): void | Promise<void> {
		this.logger.Info("Zircon service initialized");

		ZirconServer.Registry.Init(
			ZirconServerConfig.AddNamespace(new ZirconNamespace("zone", zoneCommands), ["Devs"])
				.AddNamespace(new ZirconNamespace("balance", balanceCommands), ["Devs"])
				.AddFunction(giveCommand, ["Devs"])
				.Build(),
		);
	}
}

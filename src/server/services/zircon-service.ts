import { OnInit, Service } from "@flamework/core";
import { Logger } from "@rbxts/log";
import { ZirconServer } from "@rbxts/zircon";
import { ZirconNamespace } from "@rbxts/zircon/out/Class/ZirconNamespace";
import { balanceCommands } from "@/server/commands/balance";
import { giveCommand } from "@/server/commands/give";
import { playerDataCommands } from "@/server/commands/player-data";
import { zoneCommands } from "@/server/commands/zone";
import { ZirconServerConfig } from "@/server/constants/zircon-server-config";

@Service({})
export class ZirconService implements OnInit {
	constructor(private logger: Logger) {}

	onInit(): void | Promise<void> {
		this.logger.Info("Zircon service initialized");

		ZirconServer.Registry.Init(
			ZirconServerConfig.AddNamespace(new ZirconNamespace("data", playerDataCommands), ["Devs"])
				.AddNamespace(new ZirconNamespace("zone", zoneCommands), ["Devs"])
				.AddNamespace(new ZirconNamespace("balance", balanceCommands), ["Devs"])
				.AddFunction(giveCommand, ["Devs"])
				.Build(),
		);
	}
}

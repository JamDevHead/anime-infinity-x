import { OnInit, Service } from "@flamework/core";
import { Logger } from "@rbxts/log";
import { ZirconServer } from "@rbxts/zircon";
import { ZirconServerConfig } from "@/server/constants/zircon-server-config";

@Service({})
export class Zircon implements OnInit {
	constructor(private logger: Logger) {}

	onInit(): void | Promise<void> {
		this.logger.Info("Zircon service initialized");

		ZirconServer.Registry.Init(ZirconServerConfig.Build());
	}
}

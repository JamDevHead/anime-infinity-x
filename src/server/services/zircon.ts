import { OnInit, Service } from "@flamework/core";
import { Logger } from "@rbxts/log";
import { ZirconConfigurationBuilder, ZirconServer } from "@rbxts/zircon";

@Service({})
export class Zircon implements OnInit {
	constructor(private logger: Logger) {}

	onInit(): void | Promise<void> {
		this.logger.Info("Zircon service initialized");

		ZirconServer.Registry.Init(ZirconConfigurationBuilder.default().Build());
	}
}

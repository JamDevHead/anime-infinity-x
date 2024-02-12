import { Controller, OnInit } from "@flamework/core";
import { Logger } from "@rbxts/log";
import { ZirconClient } from "@rbxts/zircon";
import { ZirconClientConfig } from "@/client/constants/zircon-client-config";

@Controller({})
export class ZirconController implements OnInit {
	constructor(private logger: Logger) {}

	onInit(): void | Promise<void> {
		this.logger.Info("Zircon controller initialized");
		task.wait(1);
		ZirconClient.Init({
			Keys: [Enum.KeyCode.Backquote, Enum.KeyCode.Insert],
		});
		ZirconClient.Registry.Init(ZirconClientConfig.Build());
	}
}

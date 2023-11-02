import { Controller, OnInit } from "@flamework/core";
import { Logger } from "@rbxts/log";
import { ZirconClient } from "@rbxts/zircon";

@Controller({})
export class Zircon implements OnInit {
	constructor(private logger: Logger) {}

	onInit(): void | Promise<void> {
		this.logger.Info("Zircon controller initialized");
		task.wait(1);
		ZirconClient.Init({
			Keys: [Enum.KeyCode.Backquote],
		});
	}
}

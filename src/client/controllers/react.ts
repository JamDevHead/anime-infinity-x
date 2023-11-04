import { Controller, OnInit } from "@flamework/core";
import { Logger } from "@rbxts/log";
import { initializeReact } from "@/client/ui/app";

@Controller()
export class React implements OnInit {
	constructor(private logger: Logger) {}

	onInit(): void | Promise<void> {
		initializeReact();
		this.logger.Info("React controller initialized");
	}
}

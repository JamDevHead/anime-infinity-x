import { Controller, OnStart } from "@flamework/core";
import { Logger } from "@rbxts/log";

@Controller()
export class ProductsController implements OnStart {
	constructor(private readonly logger: Logger) {}

	onStart(): void {
		this.logger.Info("ProductsController started!");
	}
}

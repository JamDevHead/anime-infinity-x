import { BaseComponent, Component } from "@flamework/components";
import { HttpService } from "@rbxts/services";

@Component()
export class EggComponent extends BaseComponent {
	public uuid: string;

	constructor() {
		super();
		this.uuid = HttpService.GenerateGUID(false);
	}
}

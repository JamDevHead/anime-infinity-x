import { Controller, OnStart } from "@flamework/core";
import { Signal } from "@rbxts/beacon";
import { SoundController } from "@/client/controllers/sound-controller";

@Controller()
export class UiController implements OnStart {
	public static readonly onClickSound = new Signal<void>();

	constructor(private readonly soundController: SoundController) {}

	onStart(): void {
		UiController.onClickSound.Connect(() => {
			this.soundController.tracker.play("click");
		});
	}
}

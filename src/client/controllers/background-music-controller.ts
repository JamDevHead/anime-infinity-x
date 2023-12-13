import { Controller, OnStart, OnTick } from "@flamework/core";
import { Workspace } from "@rbxts/services";
import { SoundController } from "@/client/controllers/sound-controller";
import { store } from "@/client/store";
import { selectClientSetting } from "@/client/store/settings";
import { SoundCache } from "@/shared/lib/sound-tracker/sound-cache";

@Controller()
export class BackgroundMusicController implements OnStart, OnTick {
	private timer = 0;
	private currentBackground: SoundCache | undefined;
	private soundContainer = new Instance("Folder");
	private musicEnabled = false;

	constructor(private readonly soundController: SoundController) {}

	onStart() {
		this.soundContainer.Name = "BackgroundMusicContainer";
		this.soundContainer.Parent = Workspace;

		this.soundController.tracker.addSound("ambience", "rbxassetid://6189453706");
		this.soundController.tracker.addSound("background", ["rbxassetid://1836102225", "rbxassetid://1836102253"]);

		this.soundController.tracker.play("ambience", this.soundContainer, { Volume: 0.1 });
		this.soundController.tracker.play("background", this.soundContainer, { Volume: 0.2 });

		const musicSelector = selectClientSetting("music");

		store.subscribe(musicSelector, (newSetting) => this.onSettingChange(newSetting.value as boolean));

		const newSetting = store.getState(musicSelector);

		if (newSetting !== undefined) {
			this.onSettingChange(newSetting.value as boolean);
		}
	}

	onTick(dt: number) {
		if (!this.currentBackground && this.musicEnabled) {
			this.currentBackground = this.soundController.tracker.play("background", this.soundContainer);
		}

		if (this.currentBackground) {
			this.timer += dt;

			if (this.timer >= this.currentBackground.time) {
				this.currentBackground.stop();
				this.currentBackground = undefined;
				this.timer = 0;
			}
		}
	}

	private onSettingChange(musicEnabled: boolean) {
		this.musicEnabled = musicEnabled;

		if (musicEnabled) {
			this.currentBackground?.stop();
			this.currentBackground = undefined;
			this.timer = 0;
		} else {
			this.soundController.tracker.pause("background");
		}
	}
}

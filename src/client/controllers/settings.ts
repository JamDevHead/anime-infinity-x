import { Controller, OnStart } from "@flamework/core";
import { Players } from "@rbxts/services";
import { producer } from "@/client/reflex/producers";
import remotes from "@/shared/remotes";

@Controller()
export class SettingsController implements OnStart {
	readonly Settings = remotes.Client.GetNamespace("settings");

	onStart(): void {
		const unsubscribe = producer.subscribe(
			(state) => state.settings.settings,
			(settings, oldSettings) => {
				if (settings === oldSettings) return;

				this.Settings.Get("save").SendToServer(settings);
			},
		);

		this.Settings.Get("load").Connect((settings) => {
			producer.setSettings(settings);
		});

		Players.PlayerRemoving.Connect((player) => {
			if (player !== Players.LocalPlayer) return;

			unsubscribe();
		});
	}
}

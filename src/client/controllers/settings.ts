import { Controller, OnStart } from "@flamework/core";
import { Players } from "@rbxts/services";
import { store } from "@/client/store";
import remotes from "@/shared/remotes";

@Controller()
export class SettingsController implements OnStart {
	onStart(): void {
		const unsubscribe = store.subscribe(
			(state) => state.settings.settings,
			(settings, oldSettings) => {
				if (settings === oldSettings) return;

				remotes.settings.save.fire(settings);
			},
		);

		remotes.settings.load.connect((settings) => {
			store.setSettings(settings);
		});

		Players.PlayerRemoving.Connect((player) => {
			if (player !== Players.LocalPlayer) return;

			unsubscribe();
		});
	}
}

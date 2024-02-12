import { Controller, OnStart } from "@flamework/core";
import { Players } from "@rbxts/services";
import { store } from "@/client/store";
import { selectClientSettingsPacket } from "@/client/store/settings";
import remotes from "@/shared/remotes";
import { selectPlayerSettings } from "@/shared/store/players";

@Controller()
export class SettingsController implements OnStart {
	onStart(): void {
		store.subscribe(selectClientSettingsPacket, (settings, oldSettings) => {
			if (settings === oldSettings) return;

			remotes.settings.save.fire(settings);
		});

		const settings = store.getState(selectPlayerSettings(tostring(Players.LocalPlayer.UserId)));
		if (settings === undefined) return;

		store.loadServerSettings(settings);
	}
}

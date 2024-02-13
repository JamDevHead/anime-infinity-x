import { OnStart, Service } from "@flamework/core";
import { Logger } from "@rbxts/log";
import { Setting } from "@/@types/models/setting";
import { ProfileLoad } from "@/server/services/profile-load-service";
import { store } from "@/server/store";
import { DefaultSettings } from "@/shared/constants/default-settings";
import remotes from "@/shared/remotes";

@Service()
export class SettingsService implements OnStart {
	constructor(
		protected readonly logger: Logger,
		protected readonly profileLoadService: ProfileLoad,
	) {}

	onStart(): void {
		remotes.settings.save.connect((player, settings) => {
			if (typeIs(settings, "table") === false) {
				this.logger.Warn("Player {@player} sent invalid settings {settings}", player, settings);
				return;
			}

			if (this.isMalformedPacket(settings)) {
				this.logger.Warn("Player {@player} sent malformed settings {settings}", player, settings);
				return;
			}

			this.logger.Info("Saving settings for player {@player} {settings}", player, settings);
			store.setSettings(tostring(player.UserId), settings);
		});
	}

	isMalformedPacket(settings: Record<string, Setting>): boolean {
		if (settings === undefined) return true;

		for (const [key, setting] of pairs(settings)) {
			if (DefaultSettings[key] === undefined) return true;

			if (DefaultSettings[key].label !== setting.label) return true;

			if (typeIs(setting.value, "boolean") === false && typeIs(setting.value, "number") === false) return true;

			if (setting.value === true || setting.value === false) {
				if (typeIs(DefaultSettings[key].value, "boolean") === false) return true;
			}

			if (typeIs(setting.value, "number") && typeIs(DefaultSettings[key].value, "number") === false) return true;

			if (typeIs(setting.value, "number") && setting.value < 0) return true;
		}

		return false;
	}
}

import { OnStart, Service } from "@flamework/core";
import { Logger } from "@rbxts/log";
import { OnPlayerAdd } from "@/server/services/lifecycles/on-player-add";
import { ProfileLoad } from "@/server/services/profile-load";
import remotes from "@/shared/remotes";

@Service()
export class SettingsService implements OnStart, OnPlayerAdd {
	readonly Settings = remotes.Server.GetNamespace("settings");

	constructor(
		protected readonly logger: Logger,
		protected readonly profileLoadService: ProfileLoad,
	) {}

	onStart(): void {
		this.Settings.Get("save").Connect((player, settings) => {
			if (typeIs(settings, "table") === false) {
				this.logger.Warn("Player {@player} sent invalid settings {settings}", player, settings);
				return;
			}

			this.logger.Info("Saving settings for player {@player} {settings}", player, settings);
			this.profileLoadService.setPlayerData(player, "settings", settings);
		});
	}

	onPlayerAdded(player: Player): void {
		const settings = this.profileLoadService.getPlayerData(player, "settings");
		this.Settings.Get("load").SendToPlayer(player, settings ?? {});
	}
}

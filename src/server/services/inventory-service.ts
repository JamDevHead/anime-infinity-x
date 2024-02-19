import { OnStart, Service } from "@flamework/core";
import { Logger } from "@rbxts/log";
import { TextService } from "@rbxts/services";
import { store } from "@/server/store";
import { doesPlayerHasFighter } from "@/server/utils/fighters";
import remotes from "@/shared/remotes";
import { selectPlayerInventory } from "@/shared/store/players";
import { selectPlayerFighters } from "@/shared/store/players/fighters";

@Service()
export class InventoryService implements OnStart {
	constructor(private readonly logger: Logger) {}

	onStart(): void {
		remotes.inventory.equipFighter.connect((player, fighterUid) => {
			const { fighters, inventory } = this.getPlayerFighterInventoryData(player);

			if (!inventory || !fighters) {
				this.logger.Warn("Player {@player} does not have inventory or fighters", player);
				return;
			}

			if (!doesPlayerHasFighter(player, fighterUid)) {
				return;
			}

			if (fighters.actives.find(({ fighterId }) => fighterId === fighterUid) !== undefined) {
				this.logger.Warn("Player {@player} already has fighter {fighterUid} active", player, fighterUid);
				return;
			}

			if (fighters.actives.size() >= inventory.maxFighters) {
				this.logger.Warn("Player {@player} has reached max fighters", player);
				return;
			}

			store.addActiveFighter(tostring(player.UserId), fighterUid);
		});

		remotes.inventory.unequipFighter.connect((player, fighterUid) => {
			const { fighters } = this.getPlayerFighterInventoryData(player);

			if (!doesPlayerHasFighter(player, fighterUid)) {
				this.logger.Warn("Player {@player} does not own fighter {fighterUid}", player, fighterUid);
				return;
			}

			if (fighters?.actives.find(({ fighterId }) => fighterId === fighterUid) === undefined) {
				this.logger.Warn("Player {@player} does not have fighter {fighterUid} active", player, fighterUid);
				return;
			}

			store.removeActiveFighter(tostring(player.UserId), fighterUid);
		});

		remotes.inventory.renameFighter.connect((player, fighterUid, displayName) => {
			if (!doesPlayerHasFighter(player, fighterUid)) {
				this.logger.Warn("Player {@player} does not own fighter {fighterUid}", player, fighterUid);
				return;
			}

			if (displayName.size() > 16) {
				this.logger.Warn(
					"Player {@player} tried to set fighter {fighterUid} display name to {displayName} but it was too long",
					player,
					fighterUid,
					displayName,
				);
				return;
			}

			if (displayName.size() < 3) {
				this.logger.Warn(
					"Player {@player} tried to set fighter {fighterUid} display name to {displayName} but it was too short",
					player,
					fighterUid,
					displayName,
				);
				return;
			}

			try {
				const filteredDisplayNameResult = TextService.FilterStringAsync(displayName, player.UserId);
				store.setFighterProperty(
					tostring(player.UserId),
					fighterUid,
					"displayName",
					filteredDisplayNameResult.GetNonChatStringForBroadcastAsync(),
				);
			} catch (e) {
				this.logger.Error("Error while filtering display name: {@error}", e);
			}
		});
	}

	private getPlayerFighterInventoryData(player: Player) {
		const userIdString = tostring(player.UserId);
		const fighters = store.getState(selectPlayerFighters(userIdString));
		const inventory = store.getState(selectPlayerInventory(userIdString));
		return { fighters, inventory };
	}
}

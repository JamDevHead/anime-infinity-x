import { OnStart, Service } from "@flamework/core";
import { Logger } from "@rbxts/log";
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
			const fighters = store.getState(selectPlayerFighters(tostring(player.UserId)));
			const inventory = store.getState(selectPlayerInventory(tostring(player.UserId)));

			if (!inventory || !fighters) {
				this.logger.Warn("Player {@player} does not have inventory or fighters", player);
				return;
			}

			if (!doesPlayerHasFighter(player, fighterUid)) {
				return;
			}

			if (fighters.actives.find((uid) => uid === fighterUid) !== undefined) {
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
			const fighters = store.getState(selectPlayerFighters(tostring(player.UserId)));

			if (!doesPlayerHasFighter(player, fighterUid)) {
				this.logger.Warn("Player {@player} does not own fighter {fighterUid}", player, fighterUid);
				return;
			}

			if (fighters?.actives.find((uid) => uid === fighterUid) === undefined) {
				this.logger.Warn("Player {@player} does not have fighter {fighterUid} active", player, fighterUid);
				return;
			}

			store.removeFighterTarget(fighterUid);
			store.removeActiveFighter(tostring(player.UserId), fighterUid);
		});
	}
}

import { Components } from "@flamework/components";
import { OnStart, Service } from "@flamework/core";
import { Logger } from "@rbxts/log";
import { OnPlayerAdd } from "@/server/services/lifecycles/on-player-add";
import { store } from "@/server/store";
import { getEnemyByUid } from "@/server/utils/enemies";
import { doesPlayerHasFighter } from "@/server/utils/fighters";
import remotes from "@/shared/remotes";
import { selectFighterTarget } from "@/shared/store/fighter-target/fighter-target-selectors";
import { selectActivePlayerFighters } from "@/shared/store/players/fighters";

@Service()
export class FightersTarget implements OnStart, OnPlayerAdd {
	constructor(
		private readonly logger: Logger,
		private readonly components: Components,
	) {}

	onStart() {
		remotes.fighterTarget.set.connect((player, fighterUid, targetUid) => {
			const userId = tostring(player.UserId);

			if (!doesPlayerHasFighter(player, fighterUid)) {
				this.logger.Warn(
					`Player ${userId} tried to set target for fighter ${fighterUid} but they don't own it`,
				);
				return;
			}

			const enemy = getEnemyByUid(targetUid, this.components);

			if (enemy === undefined) {
				this.logger.Warn(`Player ${userId} was trying to attack an enemy that doesn't exist`);
				return;
			}

			if (enemy.isDead) {
				this.logger.Warn(`Player ${userId} was trying to attack a dead enemy`);
				return;
			}

			store.setFighterTarget(fighterUid, targetUid);
		});

		remotes.fighterTarget.remove.connect((player, fighterUid, targetUid) => {
			const fighterTargetUid = store.getState(selectFighterTarget(fighterUid));

			if (fighterTargetUid !== targetUid) {
				return;
			}

			if (!doesPlayerHasFighter(player, fighterUid)) {
				this.logger.Warn(
					`Player ${tostring(
						player.UserId,
					)} tried to remove target for fighter ${fighterUid} but they don't own it`,
				);
				return;
			}

			store.removeFighterTarget(fighterUid);
		});
	}

	onPlayerRemoved(player: Player) {
		const userId = tostring(player.UserId);
		const fighters = store.getState(selectActivePlayerFighters(userId));

		this.logger.Debug(`Removing targets for player ${userId}`);

		fighters.forEach(({ fighterId }) => {
			store.removeFighterTarget(fighterId);
		});
	}
}

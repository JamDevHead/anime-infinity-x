import { OnStart, Service } from "@flamework/core";
import { Logger } from "@rbxts/log";
import { OnPlayerAdd } from "@/server/services/lifecycles/on-player-add";
import { store } from "@/server/store";
import { doesPlayerHasFighter } from "@/server/utils/fighters";
import remotes from "@/shared/remotes";
import { selectFighterTarget } from "@/shared/store/fighter-target/fighter-target-selectors";
import { selectActivePlayerFighters } from "@/shared/store/players/fighters";

@Service()
export class FightersTarget implements OnStart, OnPlayerAdd {
	constructor(private readonly logger: Logger) {}

	onStart() {
		remotes.fighterTarget.set.connect((player, fighterUid, targetUid) => {
			const userId = tostring(player.UserId);

			if (!doesPlayerHasFighter(player, fighterUid)) {
				this.logger.Warn(
					`Player ${userId} tried to set target for fighter ${fighterUid} but they don't own it`,
				);
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
		const fighters = store.getState(selectActivePlayerFighters(tostring(player.UserId)));

		this.logger.Debug(`Removing targets for player ${tostring(player.UserId)}`);

		fighters.forEach((fighterUid) => {
			store.removeFighterTarget(fighterUid);
		});
	}
}

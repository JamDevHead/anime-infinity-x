import { OnStart, Service } from "@flamework/core";
import { OnPlayerAdd } from "@/server/services/lifecycles/on-player-add";
import { store } from "@/server/store";
import remotes from "@/shared/remotes";
import { selectFighterTarget } from "@/shared/store/fighter-target/fighter-target-selectors";
import { selectActivePlayerFighters } from "@/shared/store/players/fighters";

@Service()
export class FightersTarget implements OnStart, OnPlayerAdd {
	onStart() {
		remotes.fighterTarget.set.connect((player, fighterUid, targetUid) => {
			store.setFighterTarget(fighterUid, targetUid);
		});

		remotes.fighterTarget.remove.connect((_, fighterUid, targetUid) => {
			const fighterTargetUid = store.getState(selectFighterTarget(fighterUid));

			if (fighterTargetUid !== targetUid) {
				return;
			}

			store.removeFighterTarget(fighterUid);
		});
	}

	onPlayerRemoved(player: Player) {
		const fighters = store.getState(selectActivePlayerFighters(tostring(player.UserId)));

		if (!fighters) {
			return;
		}

		fighters.forEach((fighterUid) => {
			store.removeFighterTarget(fighterUid);
		});
	}
}

import { OnStart, Service } from "@flamework/core";
import { store } from "@/server/store";
import remotes from "@/shared/remotes";
import { selectFighterTarget } from "@/shared/store/fighter-target/fighter-target-selectors";

@Service()
export class FightersTarget implements OnStart {
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
}

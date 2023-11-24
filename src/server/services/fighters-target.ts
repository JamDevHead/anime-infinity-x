import { OnStart, Service } from "@flamework/core";
import remotes from "@/shared/remotes";
import { store } from "@/server/store";

@Service()
export class FightersTarget implements OnStart {
	onStart() {
		remotes.fighterTarget.set.connect((player, fighterUid, targetUid) => {
			print(player, fighterUid, targetUid);
			store.setFighterTarget(fighterUid, targetUid);
		});
	}
}

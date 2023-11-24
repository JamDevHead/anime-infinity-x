import { OnStart, Service } from "@flamework/core";
import remotes from "@/shared/remotes";

@Service()
export class FightersTarget implements OnStart {
	onStart() {
		remotes.fighterTarget.set.connect((player, fighterUid, targetUid) => {
			print(player, fighterUid, targetUid);
		});
	}
}

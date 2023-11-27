import { OnStart, Service } from "@flamework/core";
import remotes from "@/shared/remotes";
import { store } from "@/server/store";

@Service()
export class FightersTarget implements OnStart {
	onStart() {
		remotes.fighterTarget.select.connect((player, enemyUid) => {
			store.setSelectedEnemy(tostring(player.UserId), enemyUid);
		});
		remotes.fighterTarget.unselect.connect((player, enemyUid) => {
			store.removeSelectedEnemy(tostring(player.UserId), enemyUid);
		});
	}
}

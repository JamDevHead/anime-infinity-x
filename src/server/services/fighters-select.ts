import { OnStart, Service } from "@flamework/core";
import { OnPlayerAdd } from "@/server/services/lifecycles/on-player-add";
import { store } from "@/server/store";
import remotes from "@/shared/remotes";

@Service()
export class FightersTarget implements OnStart, OnPlayerAdd {
	onStart() {
		remotes.fighterTarget.select.connect((player, enemyUid) => {
			store.setSelectedEnemy(tostring(player.UserId), enemyUid);
		});
		remotes.fighterTarget.unselect.connect((player, enemyUid) => {
			store.removeSelectedEnemy(tostring(player.UserId), enemyUid);
		});
	}

	onPlayerRemoved(player: Player) {
		store.deleteSelectedEnemy(tostring(player.UserId));
	}
}

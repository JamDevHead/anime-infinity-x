import { OnStart, Service } from "@flamework/core";
import { OnPlayerAdd } from "@/server/services/lifecycles/on-player-add";
import { store } from "@/server/store";
import remotes from "@/shared/remotes";

@Service()
export class EnemySelectionService implements OnStart, OnPlayerAdd {
	onStart() {
		remotes.enemySelection.select.connect((player, targetId) => {
			store.selectEnemy(tostring(player.UserId), targetId);
		});

		remotes.enemySelection.unselect.connect((player) => {
			store.unselectEnemy(tostring(player.UserId));
		});
	}

	onPlayerRemoved(player: Player) {
		store.unselectEnemy(tostring(player.UserId));
	}
}

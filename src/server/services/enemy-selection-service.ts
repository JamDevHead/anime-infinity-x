import { OnStart, Service } from "@flamework/core";
import { store } from "@/server/store";
import remotes from "@/shared/remotes";

@Service()
export class EnemySelectionService implements OnStart {
	onStart() {
		remotes.enemySelection.select.connect((player, targetId) => {
			store.selectEnemy(tostring(player.UserId), targetId);
		});

		remotes.enemySelection.unselect.connect((player) => {
			store.unselectEnemy(tostring(player.UserId));
		});
	}
}

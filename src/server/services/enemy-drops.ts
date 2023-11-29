import { OnStart, Service } from "@flamework/core";
import { store } from "@/server/store";
import remotes from "@/shared/remotes";
import { selectEnemiesDrops, selectEnemyDrop } from "@/shared/store/enemies/enemies-selectors";

@Service()
export class EnemyDrops implements OnStart {
	onStart() {
		store.observe(selectEnemiesDrops, (enemyDrops, enemyUid) => {
			print(`Enemy changed ${enemyUid} drops:`, enemyDrops);
		});

		remotes.drops.collect.connect((player, collectableId) => {
			print(`Player ${player.UserId} is trying to collect ${collectableId}`);

			const collectable = store.getState(selectEnemyDrop(collectableId));

			if (!collectable) {
				print("No collectables found");
				return;
			}

			store.removeDrop(collectableId);
		});
	}
}

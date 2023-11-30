import { OnStart, Service } from "@flamework/core";
import { Logger } from "@rbxts/log";
import { store } from "@/server/store";
import remotes from "@/shared/remotes";
import { selectEnemyDrop } from "@/shared/store/enemies/enemies-selectors";

@Service()
export class EnemyDrops implements OnStart {
	constructor(private readonly logger: Logger) {}

	onStart() {
		remotes.drops.collect.connect((player, collectableId) => {
			const collectable = store.getState(selectEnemyDrop(collectableId));

			if (!collectable) {
				this.logger.Warn("No collectables found {id}", collectableId);
				return;
			}

			store.removeDrop(collectableId);
		});
	}
}

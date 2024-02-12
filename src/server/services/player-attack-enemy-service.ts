import { Components } from "@flamework/components";
import { OnStart, Service } from "@flamework/core";
import { DpsService } from "@/server/services/dps-service";
import { store } from "@/server/store";
import { getEnemyByUid } from "@/server/utils/enemies";
import remotes from "@/shared/remotes";
import { selectEnemySelectionFromPlayer } from "@/shared/store/players/enemy-selection";

@Service()
export class PlayerAttackEnemyService implements OnStart {
	constructor(
		private components: Components,
		private dpsService: DpsService,
	) {}

	onStart() {
		remotes.attackEnemy.connect((player) => {
			const userId = tostring(player.UserId);
			const enemyId = store.getState(selectEnemySelectionFromPlayer(userId));

			if (enemyId === undefined) {
				return;
			}

			const enemy = getEnemyByUid(enemyId, this.components);

			if (enemy) {
				// TODO: calculate player damage
				const damage = 1;

				enemy.takeDamage(player, damage);
				this.dpsService.addToStore(player, damage);
			}
		});
	}
}

import { Components } from "@flamework/components";
import { OnStart, Service } from "@flamework/core";
import { EnemyDamageService } from "@/server/services/enemy-damage-service";
import { store } from "@/server/store";
import { getEnemyByUid } from "@/server/utils/enemies";
import { isFighterEquipped } from "@/server/utils/fighters";
import remotes from "@/shared/remotes";
import { selectEnemySelectionFromPlayer } from "@/shared/store/players/enemy-selection";

@Service()
export class FighterSpecialsService implements OnStart {
	constructor(
		private readonly components: Components,
		private readonly enemyDamageService: EnemyDamageService,
	) {}

	onStart() {
		remotes.fighter.activateSpecial.connect((player, fighterId) => {
			if (!isFighterEquipped(player, fighterId)) {
				return;
			}

			const playerId = tostring(player.UserId);
			const enemyId = store.getState(selectEnemySelectionFromPlayer(playerId));
			const enemy = enemyId !== undefined ? getEnemyByUid(enemyId, this.components) : undefined;

			if (!enemy) {
				return;
			}

			const specialAmount = store.getState((state) => state.fighterSpecials[fighterId]);

			if (specialAmount === undefined) {
				return;
			}

			// Add stun to fighter
			const playerStuns = this.enemyDamageService.playerStuns.get(playerId);
			const fighterStun = playerStuns?.get(fighterId) ?? 0;

			playerStuns?.set(fighterId, fighterStun + 5);

			// Remove fighter special, and give damage to enemy
			store.setFighterSpecial(fighterId, 0);
			enemy.takeDamage(player, specialAmount);
		});
	}
}

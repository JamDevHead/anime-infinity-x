import { Components } from "@flamework/components";
import { OnTick, Service } from "@flamework/core";
import { Players } from "@rbxts/services";
import { t } from "@rbxts/t";
import { DpsService } from "@/server/services/dps-service";
import { OnPlayerAdd } from "@/server/services/lifecycles/on-player-add";
import { store } from "@/server/store";
import { getEnemyByUid } from "@/server/utils/enemies";
import { selectActiveFightersFromPlayer, selectAllFightersFromPlayer } from "@/shared/store/players/fighters";
import { calculateStun } from "@/shared/utils/fighters/fighters-utils";

@Service()
export class EnemyDamageService implements OnTick, OnPlayerAdd {
	private fightersStuns = new Map<string, number>();

	private DAMAGE_TICK = 1 / 20;
	private timer = 0;

	constructor(
		private readonly components: Components,
		private readonly dpsService: DpsService,
	) {}

	onTick(dt: number) {
		const frameTime = math.min(dt, this.DAMAGE_TICK);

		this.timer += frameTime;

		while (this.timer >= this.DAMAGE_TICK) {
			this.timer -= this.DAMAGE_TICK;
			debug.profilebegin("damageEnemies");
			this.damageEnemies();
			debug.profileend();
		}
	}

	onPlayerRemoved(player: Player) {
		const fighters = store.getState(selectAllFightersFromPlayer(tostring(player.UserId))) ?? {};

		for (const [fighterId] of pairs(fighters)) {
			if (!t.string(fighterId)) {
				continue;
			}

			this.fightersStuns.delete(fighterId);
		}
	}

	private damageEnemies() {
		const enemySelections = store.getState((state) => state.players.enemySelection);

		for (const [playerId, enemyId] of pairs(enemySelections)) {
			assert(t.string(playerId));

			const userId = tonumber(playerId);
			const player = userId !== undefined ? Players.GetPlayerByUserId(userId) : undefined;

			if (!player) {
				continue;
			}

			const enemy = getEnemyByUid(enemyId, this.components);

			if (!enemy || enemy.isDead) {
				store.unselectEnemy(playerId);
				continue;
			}

			const fighters = store.getState(selectActiveFightersFromPlayer(playerId)) ?? [];

			for (const { fighterId } of fighters) {
				const fighter = store.getState(selectAllFightersFromPlayer(playerId))?.[fighterId];

				if (!fighter) {
					continue;
				}

				const stunTime = this.fightersStuns.get(fighterId);

				if (stunTime !== undefined && stunTime > 0) {
					enemy.isDead
						? this.fightersStuns.delete(fighterId)
						: this.fightersStuns.set(fighterId, stunTime - this.DAMAGE_TICK);

					continue;
				}

				const damage = fighter.stats.damage;
				const isDead = enemy.takeDamage(player, damage);

				this.dpsService.addToStore(player, damage);

				if (isDead) {
					this.fightersStuns.delete(fighterId);
					store.unselectEnemy(playerId);
				} else {
					// 10 dexterity = 1 second stun, 100 dexterity = 0.1 second stun
					this.fightersStuns.set(fighterId, calculateStun(fighter.stats.dexterity));
				}
			}
		}
	}
}

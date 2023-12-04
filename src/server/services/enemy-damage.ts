import { Components } from "@flamework/components";
import { OnStart, OnTick, Service } from "@flamework/core";
import { Logger } from "@rbxts/log";
import { Enemy } from "@/server/components/enemy";
import { store } from "@/server/store";
import { getEnemyByUid } from "@/server/utils/enemies";
import remotes from "@/shared/remotes";
import { selectSelectedEnemiesByPlayerId } from "@/shared/store/enemy-selection";
import { FighterTargetSlice } from "@/shared/store/fighter-target";
import { selectFightersTarget } from "@/shared/store/fighter-target/fighter-target-selectors";
import { selectPlayersFightersWithUid } from "@/shared/store/players/fighters";
import { getEnemyModelByUid } from "@/shared/utils/enemies";
import { calculateStun } from "@/shared/utils/fighters";

@Service()
export class EnemyDamage implements OnStart, OnTick {
	private fightersTargets = new Map<string, Enemy>();
	private fightersStuns = new Map<string, number>();

	private DAMAGE_TICK = 1 / 20;
	private timer = 0;

	constructor(
		private readonly logger: Logger,
		private readonly components: Components,
	) {}

	onStart() {
		const fighterTargetAdded = (enemyId: string, fighterId: string) => {
			const doesNotHaveFighterTarget = (fighterTarget: FighterTargetSlice) => {
				return fighterTarget[fighterId] === undefined || fighterTarget[fighterId] !== enemyId;
			};

			const cleanup = this.fighterTargetObserver(enemyId, fighterId);

			store.once(selectFightersTarget, doesNotHaveFighterTarget, () => cleanup?.());
		};

		store.subscribe(selectFightersTarget, (fightersTarget, previousFightersTarget) => {
			for (const [fighterId, enemyId] of pairs(fightersTarget)) {
				if (
					previousFightersTarget[fighterId] === undefined ||
					fightersTarget[fighterId] !== previousFightersTarget[fighterId]
				) {
					fighterTargetAdded(enemyId, fighterId as string);
				}
			}
		});

		remotes.attackEnemy.connect((player) => {
			const userId = tostring(player.UserId);
			const selectedEnemies = store.getState(selectSelectedEnemiesByPlayerId(userId));

			if (!selectedEnemies) {
				return;
			}

			selectedEnemies.forEach((enemyId) => {
				const enemy = getEnemyByUid(enemyId, this.components);

				if (!enemy) {
					return;
				}

				// TODO: calculate player damage
				enemy.takeDamage(1);
			});
		});
	}

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

	private fighterTargetObserver(enemyId: string, fighterId: string) {
		const enemyModel = getEnemyModelByUid(enemyId);
		const enemy = enemyModel && this.components.getComponent<Enemy>(enemyModel);

		if (!enemy) {
			return;
		}

		this.fightersTargets.set(fighterId, enemy);

		return () => {
			const fighterTarget = this.fightersTargets.get(fighterId);

			if (fighterTarget?.attributes.Guid !== enemy.attributes.Guid) {
				return;
			}

			this.fightersTargets.delete(fighterId);
		};
	}

	private damageEnemies() {
		for (const [fighterId, enemy] of table.clone(this.fightersTargets)) {
			const fighter = store.getState(selectPlayersFightersWithUid(fighterId));

			if (!fighter) {
				this.fightersTargets.delete(fighterId);
				continue;
			}

			if (this.fightersStuns.has(fighterId)) {
				const stunTime = this.fightersStuns.get(fighterId) as number;

				if (stunTime > 0) {
					this.fightersStuns.set(fighterId, stunTime - this.DAMAGE_TICK);
					continue;
				}
			}

			const damage = fighter.stats.damage;

			const isDead = enemy.takeDamage(damage);

			// 10 dexterity = 1 second stun, 100 dexterity = 0.1 second stun
			this.fightersStuns.set(fighterId, calculateStun(fighter.stats.dexterity));

			if (isDead) {
				store.removeFighterTarget(fighterId);
			}
		}
	}
}

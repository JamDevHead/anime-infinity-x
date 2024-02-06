import { Components } from "@flamework/components";
import { OnStart, OnTick, Service } from "@flamework/core";
import { Enemy } from "@/server/components/enemy";
import { DpsService } from "@/server/services/dps-service";
import { OnPlayerAdd } from "@/server/services/lifecycles/on-player-add";
import { store } from "@/server/store";
import { getFighterOwner } from "@/server/utils/fighters";
import { FighterTargetSlice } from "@/shared/store/fighter-target";
import { selectFightersTarget } from "@/shared/store/fighter-target/fighter-target-selectors";
import { selectPlayersFightersWithUid } from "@/shared/store/players/fighters";
import { getEnemyModelByUid } from "@/shared/utils/enemies";
import { calculateStun } from "@/shared/utils/fighters";

@Service()
export class EnemyDamage implements OnStart, OnTick, OnPlayerAdd {
	private fightersTargets = new Map<string, { owner: Player; enemy: Enemy }>();
	private fightersStuns = new Map<string, number>();

	private DAMAGE_TICK = 1 / 20;
	private timer = 0;

	constructor(
		private readonly components: Components,
		private readonly dpsService: DpsService,
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

	onPlayerRemoved(player: Player) {
		this.fightersTargets.forEach((fightersTargets, fighterId) => {
			if (fightersTargets.owner !== player) {
				return;
			}

			this.fightersTargets.delete(fighterId);
		});
	}

	private fighterTargetObserver(enemyId: string, fighterId: string) {
		const enemyModel = getEnemyModelByUid(enemyId);
		const enemy = enemyModel && this.components.getComponent<Enemy>(enemyModel);

		if (!enemy) {
			return;
		}

		const player = getFighterOwner(fighterId);

		if (player) {
			this.fightersTargets.set(fighterId, { owner: player, enemy });
		}

		return () => {
			const fighterTarget = this.fightersTargets.get(fighterId);

			if (fighterTarget?.enemy.attributes.Guid !== enemy.attributes.Guid) {
				return;
			}

			this.fightersTargets.delete(fighterId);
		};
	}

	private damageEnemies() {
		for (const [fighterId, { owner, enemy }] of table.clone(this.fightersTargets)) {
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

			this.dpsService.addToStore(owner, damage);

			const isDead = enemy.takeDamage(owner, damage);

			// 10 dexterity = 1 second stun, 100 dexterity = 0.1 second stun
			this.fightersStuns.set(fighterId, calculateStun(fighter.stats.dexterity));

			if (isDead) {
				store.removeFighterTarget(fighterId);
			}
		}
	}
}

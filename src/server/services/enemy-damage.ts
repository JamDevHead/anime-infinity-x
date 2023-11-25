import { Components } from "@flamework/components";
import { OnStart, OnTick, Service } from "@flamework/core";
import { Logger } from "@rbxts/log";
import { Enemy } from "@/server/components/enemy";
import { store } from "@/server/store";
import { selectFightersTarget } from "@/shared/store/fighter-target/fighter-target-selectors";
import { selectPlayerFighterWithUid } from "@/shared/store/players/fighters";
import { getEnemyModelByUid } from "@/shared/utils/enemies";

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
		store.observe(selectFightersTarget, (enemyId, fighterId) => {
			print("create fighter target", enemyId, fighterId);
			const enemyModel = getEnemyModelByUid(enemyId);
			const enemy = enemyModel && this.components.getComponent<Enemy>(enemyModel);

			if (!enemy) {
				return;
			}

			this.fightersTargets.set(fighterId as string, enemy);

			return () => {
				print("unobserve", enemyId, fighterId);
				this.fightersTargets.delete(fighterId as string);
			};
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

	private damageEnemies() {
		for (const [fighterId, enemy] of this.fightersTargets) {
			const fighter = store.getState(selectPlayerFighterWithUid(fighterId));

			if (!fighter) {
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

			enemy.humanoid.TakeDamage(damage);

			// 10 dexterity = 1 second stun, 100 dexterity = 0.1 second stun
			this.fightersStuns.set(fighterId, 10 / fighter.stats.dexterity);

			if (enemy.humanoid.Health <= 0) {
				store.removeFighterTarget(fighterId);
				enemy.instance.Destroy();
			}
		}
	}
}

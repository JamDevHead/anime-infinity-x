import { Components } from "@flamework/components";
import { Controller, OnStart, OnTick } from "@flamework/core";
import { Players } from "@rbxts/services";
import { Enemy } from "@/client/components/enemy-component";
import { CharacterAdd } from "@/client/controllers/lifecycles/on-character-add";
import { store } from "@/client/store";
import { selectSpecificPerk } from "@/client/store/perks";
import { getEnemyByUid } from "@/client/utils/enemies";
import remotes from "@/shared/remotes";
import { selectSelectedEnemiesByPlayerId } from "@/shared/store/enemy-selection";

@Controller()
export class FighterAutoclick implements OnStart, OnTick {
	private autoClickEnabled = false;
	private selectedEnemy?: Enemy;
	private timer = 0;
	private userId = tostring(Players.LocalPlayer.UserId);

	constructor(
		private readonly characterAdd: CharacterAdd,
		private readonly components: Components,
	) {}

	onStart() {
		const selectedEnemies = selectSelectedEnemiesByPlayerId(this.userId);

		store.subscribe(selectSpecificPerk("autoclick"), (autoClickEnabled) => {
			this.autoClickEnabled = autoClickEnabled;
		});

		store.subscribe(selectedEnemies, (enemies, previousEnemies) =>
			this.updateSelectedEnemies(enemies, previousEnemies),
		);
		this.updateSelectedEnemies(store.getState(selectedEnemies), undefined);
	}

	onTick(dt: number) {
		if (!this.autoClickEnabled || !this.selectedEnemy) {
			return;
		}

		this.timer += dt;

		if (this.timer < 0.1) {
			return;
		}

		this.timer = 0;
		remotes.attackEnemy.fire();
	}

	private updateSelectedEnemies(
		selectedEnemies: string[] | undefined,
		previousSelectedEnemies: string[] | undefined,
	) {
		if (!selectedEnemies) {
			return;
		}
		const doesNotHaveTarget = (enemyUid: string) => (enemies: string[] | undefined) => {
			return enemies?.includes(enemyUid) === false;
		};

		for (const [enemyIndex, enemyUid] of pairs(selectedEnemies)) {
			if (previousSelectedEnemies?.[enemyIndex] !== undefined) {
				continue;
			}

			const cleanup = this.onSelectedEnemy(enemyUid);

			store.once(selectSelectedEnemiesByPlayerId(this.userId), doesNotHaveTarget(enemyUid), cleanup);
		}
	}

	private onSelectedEnemy(enemyUid: string) {
		const enemy = getEnemyByUid(enemyUid, this.components);

		if (enemy) {
			this.selectedEnemy = enemy;
		}

		return () => {
			this.selectedEnemy = undefined;
		};
	}
}

import { Components } from "@flamework/components";
import { Controller, OnStart, OnTick } from "@flamework/core";
import { Enemy } from "@/client/components/enemy-component";
import { EnemySelectorController } from "@/client/controllers/enemy-selector-controller";
import { CharacterAdd } from "@/client/controllers/lifecycles/on-character-add";
import { store } from "@/client/store";
import { selectSpecificPerk } from "@/client/store/perks";

const HORIZONTAL_VECTOR = new Vector3(1, 0, 1);

@Controller()
export class FighterAutofarmController implements OnStart, OnTick {
	private autofarmEnabled = false;
	private minDistance = 30;
	private selectedEnemy?: Enemy;

	constructor(
		private readonly characterAdd: CharacterAdd,
		private readonly components: Components,
		private readonly enemySelector: EnemySelectorController,
	) {}

	onStart() {
		store.subscribe(selectSpecificPerk("autofarm"), (autoFarmEnabled) => {
			this.autofarmEnabled = autoFarmEnabled;
		});
	}

	onTick() {
		if (!this.autofarmEnabled) {
			return;
		}

		const closestEnemy = this.getClosestEnemy();

		if (closestEnemy === this.selectedEnemy) {
			return;
		}

		if (closestEnemy === undefined) {
			this.enemySelector.clearSelection();
			this.selectedEnemy = undefined;
			return;
		}

		this.selectedEnemy = closestEnemy;
		this.enemySelector.setSelection(closestEnemy.attributes.Guid);
	}

	private getClosestEnemy() {
		const character = this.characterAdd.character;

		if (!character) {
			return;
		}

		const enemies = this.components.getAllComponents<Enemy>();
		const origin = character.GetPivot().Position.mul(HORIZONTAL_VECTOR);

		return enemies.reduce(
			(closestEnemy, enemy) => {
				const enemyDistance = enemy.root.Position.mul(HORIZONTAL_VECTOR).sub(origin).Magnitude;

				if (closestEnemy === undefined && enemyDistance < this.minDistance) {
					return enemy;
				}

				const closestEnemyDistance = closestEnemy?.root.Position.mul(HORIZONTAL_VECTOR).sub(origin).Magnitude;

				if (
					closestEnemyDistance !== undefined &&
					enemyDistance < closestEnemyDistance &&
					enemyDistance < this.minDistance
				) {
					return enemy;
				}

				return closestEnemy;
			},
			undefined as Enemy | undefined,
		);
	}
}

import { Components } from "@flamework/components";
import { Controller, OnStart, OnTick } from "@flamework/core";
import { Enemy } from "@/client/components/enemy-component";
import { CharacterAdd } from "@/client/controllers/lifecycles/on-character-add";
import { store } from "@/client/store";
import { selectSpecificPerk } from "@/client/store/perks";
import remotes from "@/shared/remotes";

@Controller()
export class FighterAutofarmController implements OnStart, OnTick {
	private autofarmEnabled = false;
	private minDistance = 10;
	private selectedEnemy?: Enemy;

	constructor(
		private readonly characterAdd: CharacterAdd,
		private readonly components: Components,
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
			remotes.fighterTarget.unselectAll.fire();
			this.selectedEnemy = undefined;
			return;
		}

		this.selectedEnemy = closestEnemy;
		remotes.fighterTarget.unselectAll.fire();
		remotes.fighterTarget.select.fire(closestEnemy.attributes.Guid);
	}

	private getClosestEnemy() {
		const character = this.characterAdd.character;

		if (!character) {
			return;
		}

		const enemies = this.components.getAllComponents<Enemy>();
		const origin = character.GetPivot().Position;

		return enemies.reduce(
			(closestEnemy, enemy) => {
				const enemyDistance = enemy.root.Position.sub(origin).Magnitude;

				if (closestEnemy === undefined && enemyDistance < this.minDistance) {
					return enemy;
				}

				const closestEnemyDistance = closestEnemy?.root.Position.sub(origin).Magnitude;

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

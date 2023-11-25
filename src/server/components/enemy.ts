import { Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { store } from "@/server/store";
import { EnemyComponent } from "@/shared/components/enemy-component";
import { selectSelectedEnemies } from "@/shared/store/enemy-selection";

@Component({ tag: "EnemyNPC" })
export class Enemy extends EnemyComponent implements OnStart {
	onStart() {
		store.addEnemy(this.attributes.Guid);

		this.humanoid.MaxHealth = 100;
		this.humanoid.Health = 5;
		this.humanoid.BreakJointsOnDeath = false;

		this.root.Anchored = true;
	}

	destroy() {
		super.destroy();

		const enemiesSelected = store.getState(selectSelectedEnemies);

		for (const [playerId, enemies] of pairs(enemiesSelected)) {
			if (enemies?.includes(this.attributes.Guid)) {
				store.removeSelectedEnemy(playerId as string, this.attributes.Guid);
			}
		}
		store.removeEnemy(this.attributes.Guid);
	}
}

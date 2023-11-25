import { Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { store } from "@/server/store";
import { EnemyComponent } from "@/shared/components/enemy-component";

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
		store.removeEnemy(this.attributes.Guid);
		this.instance.Destroy();
	}
}

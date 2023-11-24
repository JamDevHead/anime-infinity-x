import { Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { store } from "@/server/store";
import { EnemyComponent } from "@/shared/components/enemy-component";

@Component({ tag: "EnemyNPC" })
export class Enemy extends EnemyComponent implements OnStart {
	onStart() {
		store.addEnemy(this.attributes.Guid);

		this.humanoid.MaxHealth = 0;
		this.humanoid.Health = 0;
		this.humanoid.BreakJointsOnDeath = false;

		this.root.Anchored = true;
	}
}

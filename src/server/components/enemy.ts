import { BaseComponent, Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { producer } from "@/server/reflex/producers";

export interface EnemyModel extends Model {
	Humanoid: Humanoid;
	HumanoidRootPart: Part;
}

interface EnemyAttributes {
	Guid: string;
}

@Component({ tag: "EnemyNPC" })
export class Enemy extends BaseComponent<EnemyAttributes, EnemyModel> implements OnStart {
	private humanoid = this.instance.Humanoid;
	private root = this.instance.HumanoidRootPart;

	onStart() {
		producer.addEnemy(this.attributes.Guid);

		this.humanoid.MaxHealth = 0;
		this.humanoid.Health = 0;
		this.humanoid.BreakJointsOnDeath = false;

		this.root.Anchored = true;
	}
}

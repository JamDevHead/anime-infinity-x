import { BaseComponent, Component } from "@flamework/components";
import { OnStart } from "@flamework/core";

export interface EnemyModel extends Model {
	Humanoid: Humanoid;
}

interface EnemyAttributes {
	Guid: string;
}

@Component({ tag: "EnemyNPC" })
export class Enemy extends BaseComponent<EnemyAttributes, EnemyModel> implements OnStart {
	private humanoid = this.instance.Humanoid;
	private guid = this.attributes.Guid;

	onStart() {}
}

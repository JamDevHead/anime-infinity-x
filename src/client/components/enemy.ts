import { BaseComponent, Component } from "@flamework/components";

export interface EnemyModel extends Model {
	Humanoid: Humanoid;
}

interface EnemyAttributes {
	Guid: string;
}

@Component({ tag: "EnemyNPC" })
export class Enemy extends BaseComponent<EnemyAttributes, EnemyModel> {
	private humanoid = this.instance.Humanoid;
	private guid = this.attributes.Guid;
}

import { BaseComponent, Component } from "@flamework/components";

export interface EnemyModel extends Model {
	Humanoid: Humanoid;
	HumanoidRootPart: Part;
}

interface EnemyAttributes {
	Guid: string;
	Type: "Level 1" | "Level 2" | "Level 3" | "Level 4" | "Boss";
	Scale?: number;
}

@Component({ tag: "EnemyNPC" })
export class EnemyComponent extends BaseComponent<EnemyAttributes, EnemyModel> {
	public root = this.instance.HumanoidRootPart;
	public humanoid = this.instance.Humanoid;
	public attackingFighters = new Array<string>();

	// private guid = this.attributes.Guid;
}

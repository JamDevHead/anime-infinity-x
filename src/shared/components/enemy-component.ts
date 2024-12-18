import { BaseComponent, Component } from "@flamework/components";
import { Trove } from "@rbxts/trove";

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
	public trove = new Trove();
	public isDead = false;

	constructor() {
		super();

		let currentHealth = this.humanoid.Health;
		this.isDead = currentHealth <= 0;

		this.trove.add(
			this.humanoid.HealthChanged.Connect((health) => {
				this.onHealthChanged?.(currentHealth, health);
				this.isDead = health <= 0;
				currentHealth = health;
			}),
		);
	}

	destroy() {
		super.destroy();

		this.trove.destroy();
		this.onDestroy?.();
	}

	onDestroy?(): void;
	onHealthChanged?(currentHealth: number, newHealth: number): void;
}

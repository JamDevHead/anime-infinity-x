import { BaseComponent, Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { Logger } from "@rbxts/log";
import { HttpService, ServerStorage } from "@rbxts/services";
import { EnemySpawner } from "@/server/services/enemy-spawner";
import { EnemyModel } from "@/shared/components/enemy-component";

interface EnemyAttributes {
	EnemyZone: string;
	AllowedEnemies: string | undefined;
	Type: "Boss" | "Level 1" | "Level 2" | "Level 3" | "Level 4" | undefined;
}

@Component({ tag: "EnemySpawner" })
export class Enemy extends BaseComponent<EnemyAttributes, Part> implements OnStart {
	private currentEnemy: EnemyModel | undefined;
	private enemiesZone = ServerStorage.assets.Avatars.NPCsModels.FindFirstChild(this.attributes.EnemyZone);
	private spawnerSurfaceCFrame = this.instance.CFrame.sub(Vector3.yAxis.mul(this.instance.Size.Y / 2));
	private enemies: Instance[] = [];

	constructor(
		private readonly logger: Logger,
		private readonly enemiesSpawner: EnemySpawner,
	) {
		super();
	}

	onStart() {
		assert(this.enemiesZone !== undefined, `Failed to get enemy zone: ${this.attributes.EnemyZone}`);

		this.instance.Anchored = true;
		this.instance.CanCollide = false;
		this.instance.CanQuery = false;
		this.instance.CanTouch = false;
		this.instance.Transparency = 1;

		this.enemies = this.enemiesZone?.GetChildren().filter((enemy) => {
			let valid = enemy.GetAttribute("Type") !== "" && enemy.GetAttribute("Type") !== undefined;

			if (valid && this.attributes.AllowedEnemies !== undefined) {
				const allowedEnemies = this.attributes.AllowedEnemies.split(",");
				valid = allowedEnemies.find((allowedEnemy) => allowedEnemy === enemy.Name) !== undefined;
			}

			if (valid && this.attributes.Type !== undefined) {
				valid = enemy.GetAttribute("Type") === this.attributes.Type;
			}

			return valid;
		});

		if (this.enemies.isEmpty()) {
			this.logger.Debug(`Enemy array list is empty from ${this.attributes.EnemyZone}`);
			return;
		}

		const enemy = this.getEnemy();

		if (enemy) {
			this.spawn(enemy);
		}
	}

	private getEnemy(tries?: number): EnemyModel | undefined {
		if (this.enemies.isEmpty()) {
			return undefined;
		}

		const enemy = this.enemies[math.random(this.enemies.size()) - 1] as EnemyModel | undefined;

		if (!enemy) {
			tries = tries ?? 0;

			if (tries > 10) {
				return;
			}

			return this.getEnemy(tries + 1);
		}

		return enemy;
	}

	private spawn(enemy: EnemyModel) {
		const clonedEnemy = enemy.Clone();
		const rootCFrame = clonedEnemy.HumanoidRootPart.GetPivot();

		clonedEnemy.PrimaryPart = undefined;
		clonedEnemy.WorldPivot = rootCFrame.sub(Vector3.yAxis.mul(3));
		clonedEnemy.PivotTo(this.spawnerSurfaceCFrame);
		clonedEnemy.SetAttribute("Guid", HttpService.GenerateGUID(false));
		clonedEnemy.AddTag("EnemyNPC");

		clonedEnemy.Parent = this.enemiesSpawner.enemiesFolder;

		this.currentEnemy?.Destroy();
		this.currentEnemy = clonedEnemy;

		clonedEnemy.Destroying.Connect(() => {
			this.currentEnemy = undefined;
			task.wait(2);
			const newEnemy = this.getEnemy();

			if (newEnemy) {
				this.spawn(newEnemy);
			}
		});
	}
}

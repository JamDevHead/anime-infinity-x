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

		const enemy = this.getEnemy();

		if (enemy) {
			this.spawn(enemy);
		}
	}

	getEnemy(tries?: number): EnemyModel | undefined {
		let enemies =
			this.enemiesZone
				?.GetChildren()
				.filter((enemy) => enemy.GetAttribute("Type") !== "" && enemy.GetAttribute("Type") !== undefined) ?? [];

		if (this.attributes.AllowedEnemies !== undefined) {
			const allowedEnemies = this.attributes.AllowedEnemies.split(",");
			enemies = enemies.filter(
				(enemy) => allowedEnemies.find((allowedEnemy) => allowedEnemy === enemy.Name) !== undefined,
			);
		}

		if (this.attributes.Type !== undefined) {
			enemies = enemies.filter((enemy) => enemy.GetAttribute("Type") === this.attributes.Type);
		}

		if (enemies.isEmpty()) {
			this.logger.Debug("Enemy array list is empty");
			return undefined;
		}

		const enemy = enemies[math.random(enemies.size()) - 1] as EnemyModel | undefined;

		if (!enemy) {
			tries = tries ?? 0;

			if (tries > 10) {
				return;
			}

			return this.getEnemy(tries + 1);
		}

		return enemy;
	}

	spawn(enemy: EnemyModel) {
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

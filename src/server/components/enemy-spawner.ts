import { BaseComponent, Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { Logger } from "@rbxts/log";
import { HttpService, ServerStorage } from "@rbxts/services";
import { EnemyModel } from "@/server/components/enemy";
import { EnemiesSpawner } from "@/server/services/enemies-spawner";

interface EnemyAttributes {
	EnemyZone: string;
	AllowedEnemies: string | undefined;
}

@Component({ tag: "EnemySpawner" })
export class Enemy extends BaseComponent<EnemyAttributes, Part> implements OnStart {
	private currentEnemy: EnemyModel | undefined;
	private enemiesZone = ServerStorage.assets.Avatars.NPCsModels.FindFirstChild(this.attributes.EnemyZone);
	private spawnerSurfaceCFrame = this.instance.CFrame.sub(Vector3.yAxis.mul(this.instance.Size.Y / 2));

	constructor(
		private readonly logger: Logger,
		private readonly enemiesSpawner: EnemiesSpawner,
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

	getEnemy(): EnemyModel | undefined {
		let enemies = this.enemiesZone?.GetChildren() ?? [];

		if (this.attributes.AllowedEnemies !== undefined) {
			const allowedEnemies = this.attributes.AllowedEnemies.split(",");
			enemies = enemies.filter(
				(enemy) => allowedEnemies.find((allowedEnemy) => allowedEnemy === enemy.Name) !== undefined,
			);
		}

		if (enemies.isEmpty()) {
			this.logger.Debug("Enemy array list is empty");
			return undefined;
		}

		const enemy = enemies[math.random(1, enemies.size())] as EnemyModel | undefined;

		if (!enemy) {
			return this.getEnemy();
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

		clonedEnemy.ScaleTo(tonumber(clonedEnemy.GetAttribute("Scale")) ?? 1.5);

		clonedEnemy.Parent = this.enemiesSpawner.enemiesFolder;

		this.currentEnemy?.Destroy();
		this.currentEnemy = clonedEnemy;
	}
}

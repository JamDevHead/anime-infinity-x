import { Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { HttpService } from "@rbxts/services";
import { store } from "@/server/store";
import { EnemyComponent } from "@/shared/components/enemy-component";
import { selectEnemyDrops } from "@/shared/store/enemies/enemies-selectors";
import { selectSelectedEnemies } from "@/shared/store/enemy-selection";

@Component({ tag: "EnemyNPC" })
export class Enemy extends EnemyComponent implements OnStart {
	onStart() {
		this.humanoid.MaxHealth = 100;
		this.humanoid.Health = 100;
		this.humanoid.BreakJointsOnDeath = false;

		const animator = this.humanoid.FindFirstChild("Animator") ?? new Instance("Animator");
		animator.Parent = this.humanoid;

		this.root.Anchored = true;

		this.instance.GetDescendants().forEach((descendant) => {
			if (!descendant.IsA("BasePart")) {
				return;
			}

			descendant.CanCollide = false;
			descendant.CollisionGroup = "Enemies";
		});
	}

	destroy() {
		super.destroy();

		const enemiesSelected = store.getState(selectSelectedEnemies);
		const killers = new Set<string>();

		for (const [playerId, enemies] of pairs(enemiesSelected)) {
			if (enemies?.includes(this.attributes.Guid)) {
				store.removeSelectedEnemy(playerId as string, this.attributes.Guid);
			}

			if (!killers.has(playerId as string)) {
				killers.add(playerId as string);
			}
		}

		killers.forEach((killerId) => {
			for (const _ of $range(1, 20)) {
				const id = HttpService.GenerateGUID(false);

				store.addDrop(this.attributes.Guid, {
					owner: killerId,
					id,
					type: "Gold",
					quantity: math.random(1, 10),
					origin: this.root.Position,
				});
			}
		});

		task.delay(5, () => {
			this.instance.Destroy();
		});

		task.delay(60, () => {
			const drops = store.getState(selectEnemyDrops(this.attributes.Guid));

			drops.forEach((drop) => {
				store.removeDrop(drop.id);
			});
		});
	}
}

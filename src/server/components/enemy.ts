import { Component } from "@flamework/components";
import { OnStart } from "@flamework/core";
import { HttpService } from "@rbxts/services";
import { MissionDecoratorService } from "server/services/missions-service";
import { store } from "@/server/store";
import { EnemyComponent } from "@/shared/components/enemy-component";
import { selectEnemyDrops } from "@/shared/store/enemies/enemies-selectors";

const MAX_ASSIST_TIME = 10; // seconds

@Component({ tag: "EnemyNPC" })
export class Enemy extends EnemyComponent implements OnStart {
	private playersInvolved = new Map<Player, number>();
	private level = this.attributes.Type === "Boss" ? 5 : tonumber(this.attributes.Type.sub(-1)) ?? 1;

	constructor(private readonly missionDecoratorService: MissionDecoratorService) {
		super();
	}

	onStart() {
		const calculatedHealth = math.max(this.level * 2, 1) * 100;

		this.humanoid.MaxHealth = calculatedHealth;
		this.humanoid.Health = calculatedHealth;
		this.humanoid.BreakJointsOnDeath = false;

		// scale 20% per level
		this.instance.ScaleTo(this.attributes.Scale ?? 1 + this.level * 0.2);

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

	onDestroy() {
		const coinsToSpawn = this.level * 9 + 1;

		this.playersInvolved.forEach((timeOfDamage, author) => {
			const timeDiff = tick() - timeOfDamage;

			if (timeDiff > MAX_ASSIST_TIME) {
				return;
			}

			const playerId = tostring(author.UserId);
			this.missionDecoratorService.taskSignal.Fire("Kill", playerId, this);

			for (const _ of $range(1, coinsToSpawn)) {
				this.spawnCoinsForPlayer(playerId);
			}
		});

		this.playersInvolved.clear();

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

	public takeDamage(author: Player, damage: number) {
		this.humanoid.TakeDamage(damage);
		this.playersInvolved.set(author, tick());

		const isDead = this.humanoid.Health <= 0;

		if (isDead) {
			this.instance.RemoveTag("EnemyNPC");
		}

		return isDead;
	}

	private spawnCoinsForPlayer(playerId: string) {
		const id = HttpService.GenerateGUID(false);

		store.addDrop(this.attributes.Guid, {
			owner: playerId,
			id,
			type: "Gold",
			quantity: 1,
			origin: this.root.Position,
		});
	}
}

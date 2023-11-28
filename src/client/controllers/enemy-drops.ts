import { Components } from "@flamework/components";
import { Controller, OnStart } from "@flamework/core";
import { Workspace } from "@rbxts/services";
import { store } from "@/client/store";
import { getEnemyByUid } from "@/client/utils/enemies";
import { Drop } from "@/shared/store/enemies/drops";
import { selectEnemiesDrops } from "@/shared/store/enemies/enemies-selectors";

@Controller()
export class EnemyDrops implements OnStart {
	private dropContainer = new Instance("Folder");

	constructor(private components: Components) {}

	onStart() {
		this.dropContainer.Name = "Drops";
		this.dropContainer.Parent = Workspace;

		const onEnemyDrops = (enemyId: string, drops: Drop[]) => {
			drops.forEach((drop) => {
				onEnemyDrop(enemyId, drop);
			});
		};

		const onEnemyDrop = (enemyId: string, drop: Drop) => {
			const enemy = getEnemyByUid(enemyId, this.components);

			if (!enemy) {
				return;
			}

			const dropInstance = new Instance("Part");

			dropInstance.Anchored = false;
			dropInstance.Size = Vector3.one;
			dropInstance.Position = enemy.root.Position.add(new Vector3(0, 5, 0));

			dropInstance.Name = "Drop";
			dropInstance.Parent = this.dropContainer;
		};

		store.subscribe(selectEnemiesDrops, (enemyDrops, previousEnemyDrops) => {
			for (const [id, drops] of pairs(enemyDrops)) {
				if (previousEnemyDrops[id] === undefined || previousEnemyDrops[id]?.size() !== drops.size()) {
					print("Enemy drops changed", drops, previousEnemyDrops[id]);
					onEnemyDrops(id as string, drops);
				}
			}
		});
	}
}

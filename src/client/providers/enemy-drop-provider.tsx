import { Components } from "@flamework/components";
import { useSelectorCreator } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { EnemyDrop } from "@/client/components/react/enemy-drop";
import { getEnemyByUid } from "@/client/utils/enemies";
import { selectEnemiesDropsByOwnerId } from "@/shared/store/enemies/enemies-selectors";

const enemyRootCache = new Map<string, Vector3>();

export function EnemyDropProvider({ ownerId, components }: { ownerId: string; components: Components }) {
	const drops = useSelectorCreator(selectEnemiesDropsByOwnerId, ownerId);

	return (
		<>
			{drops.mapFiltered((drop) => {
				const enemy = getEnemyByUid(drop.enemyId, components);
				let position = enemyRootCache.get(drop.enemyId);

				if (enemy && !position) {
					position = enemy.root.Position;
					enemyRootCache.set(drop.enemyId, position);
					task.delay(60, () => enemyRootCache.delete(drop.enemyId));
				}

				return position ? <EnemyDrop drop={drop} origin={position} /> : undefined;
			})}
		</>
	);
}

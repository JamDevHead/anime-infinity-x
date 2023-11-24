import { getEnemyModelByUid } from "@/shared/utils/enemies";
import { Components } from "@flamework/components";
import { EnemyComponent } from "@/shared/components/enemy-component";

const enemyCache = new Map<string, EnemyComponent>();

export function getEnemyByUid(uid: string, components: Components) {
	const enemyCached = enemyCache.get(uid);

	if (enemyCached !== undefined && enemyCached.root.Parent) {
		return enemyCache.get(uid);
	} else {
		enemyCache.delete(uid);
	}

	const enemyModel = getEnemyModelByUid(uid);
	const enemyComponent = enemyModel ? components.getComponent<EnemyComponent>(enemyModel) : undefined;

	if (!enemyComponent) {
		return undefined;
	}

	enemyCache.set(uid, enemyComponent);
	return enemyComponent;
}

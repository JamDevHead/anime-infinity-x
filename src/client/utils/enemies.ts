import { Components } from "@flamework/components";
import { Enemy } from "@/client/components/enemy-component";
import { getEnemyModelByUid } from "@/shared/utils/enemies";

const enemyCache = new Map<string, Enemy>();

export function getEnemyByUid(uid: string, components: Components) {
	const enemyCached = enemyCache.get(uid);

	if (enemyCached !== undefined && enemyCached.root.Parent) {
		return enemyCache.get(uid);
	} else {
		enemyCache.delete(uid);
	}

	const enemyModel = getEnemyModelByUid(uid);
	const enemyComponent = enemyModel ? components.getComponent<Enemy>(enemyModel) : undefined;

	if (!enemyComponent) {
		return undefined;
	}

	enemyCache.set(uid, enemyComponent);
	return enemyComponent;
}

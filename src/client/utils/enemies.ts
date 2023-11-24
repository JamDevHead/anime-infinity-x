import { getEnemyModelByUid } from "@/shared/utils/enemies";
import { Components } from "@flamework/components";
import { EnemyComponent } from "@/shared/components/enemy-component";

export function getEnemyByUid(uid: string, components: Components) {
	const enemyModel = getEnemyModelByUid(uid);

	return enemyModel ? components.getComponent<EnemyComponent>(enemyModel) : undefined;
}

import Roact from "@rbxts/roact";
import { EnemyAura } from "@/client/components/react/enemy-aura";
import { createPortal } from "@rbxts/react-roblox";
import { useRootSelector } from "@/client/store";
import { selectSelectedEnemiesByPlayerId } from "shared/store/enemy-selection";
import { EnemyHover } from "@/client/components/react/enemy-hover";
import { selectHoveredEnemy } from "@/client/store/enemy-hover";
import { getEnemyByUid } from "@/client/utils/enemies";
import { Components } from "@flamework/components";

export function EnemyProvider({ userId, components }: { userId: string; components: Components }) {
	const selectedEnemies = useRootSelector(selectSelectedEnemiesByPlayerId(userId));
	const hoveredEnemyUid = useRootSelector(selectHoveredEnemy);

	const hoveredEnemy = hoveredEnemyUid ? getEnemyByUid(hoveredEnemyUid, components) : undefined;

	return (
		<>
			{selectedEnemies.map((enemyUid) => {
				const enemy = getEnemyByUid(enemyUid, components);

				if (enemy) {
					createPortal(<EnemyAura enemy={enemy} />, enemy.instance);
				}
			})}
			{hoveredEnemy && createPortal(<EnemyHover />, hoveredEnemy.instance)}
		</>
	);
}

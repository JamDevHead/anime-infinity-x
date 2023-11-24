import Roact from "@rbxts/roact";
import { useRootSelector } from "@/client/store";
import { selectSelectedEnemiesByPlayerId } from "shared/store/enemy-selection";
import { getEnemyModelByUid } from "@/shared/utils/enemies";
import { createPortal } from "@rbxts/react-roblox";
import { EnemyAura } from "@/client/components/react/enemy-aura";
import { selectHoveredEnemy } from "@/client/store/enemy-hover";
import { EnemyHover } from "@/client/components/react/enemy-hover";

function SelectionProvider({ userId }: { userId: string }) {
	const selectedEnemies = useRootSelector(selectSelectedEnemiesByPlayerId(userId));

	print("rendering enemy provider");

	return (
		<>
			{selectedEnemies?.map((enemyUid) => {
				const enemy = getEnemyModelByUid(enemyUid);

				if (enemy) {
					return createPortal(<EnemyAura enemy={enemy} />, enemy);
				}
			})}
		</>
	);
}

function HoverProvider() {
	const hoveredEnemyUid = useRootSelector(selectHoveredEnemy);

	const hoveredEnemy = hoveredEnemyUid ? getEnemyModelByUid(hoveredEnemyUid) : undefined;

	return <>{hoveredEnemy && createPortal(<EnemyHover />, hoveredEnemy)}</>;
}

export function EnemyProvider({ userId }: { userId: string }) {
	return (
		<>
			<SelectionProvider userId={userId} />
			<HoverProvider />
		</>
	);
}

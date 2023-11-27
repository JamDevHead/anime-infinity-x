import { createPortal } from "@rbxts/react-roblox";
import Roact from "@rbxts/roact";
import { selectSelectedEnemiesByPlayerId } from "shared/store/enemy-selection";
import { EnemyAura } from "@/client/components/react/enemy-aura";
import { EnemyHover } from "@/client/components/react/enemy-hover";
import { useRootSelector } from "@/client/store";
import { selectHoveredEnemy } from "@/client/store/enemy-hover";
import { getEnemyModelByUid } from "@/shared/utils/enemies";

function SelectionProvider({ userId }: { userId: string }) {
	const selectedEnemies = useRootSelector(selectSelectedEnemiesByPlayerId(userId));

	return (
		<>
			{selectedEnemies?.map((enemyUid) => {
				const enemy = getEnemyModelByUid(enemyUid);

				if (enemy) {
					return createPortal(<EnemyAura enemy={enemy} />, enemy);
				} else {
					return <></>;
				}
			})}
		</>
	);
}

function HoverProvider() {
	const hoveredEnemyUid = useRootSelector(selectHoveredEnemy);

	const hoveredEnemy = hoveredEnemyUid !== undefined ? getEnemyModelByUid(hoveredEnemyUid) : undefined;

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

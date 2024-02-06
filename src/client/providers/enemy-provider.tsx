import { Components } from "@flamework/components";
import { useSelectorCreator } from "@rbxts/react-reflex";
import { createPortal } from "@rbxts/react-roblox";
import Roact, { useEffect, useMemo, useRef } from "@rbxts/roact";
import { Enemy } from "@/client/components/enemy-component";
import { EnemyAura } from "@/client/components/react/enemy-aura";
import { useRootSelector } from "@/client/store";
import { selectHoveredEnemy } from "@/client/store/enemy-hover";
import { getEnemyByUid } from "@/client/utils/enemies";
import { selectEnemySelectionFromPlayer } from "@/shared/store/players/enemy-selection";

function SelectionProvider({ userId, components }: { userId: string; components: Components }) {
	const enemyId = useSelectorCreator(selectEnemySelectionFromPlayer, userId);
	const enemy = enemyId !== undefined ? getEnemyByUid(enemyId, components) : undefined;

	return enemy !== undefined ? createPortal(<EnemyAura enemy={enemy} />, enemy.instance) : <></>;
}

function HoverProvider({ components }: { components: Components }) {
	const hoveredEnemyUid = useRootSelector(selectHoveredEnemy);
	const lastHoveredEnemy = useRef<Enemy | undefined>();

	const hoveredEnemy = useMemo(() => {
		return hoveredEnemyUid !== undefined ? getEnemyByUid(hoveredEnemyUid, components) : undefined;
	}, [components, hoveredEnemyUid]);

	useEffect(() => {
		if (lastHoveredEnemy.current) {
			if (lastHoveredEnemy.current.highlight.OutlineTransparency === 0) {
				lastHoveredEnemy.current.highlight.OutlineTransparency = 1;
			}
			lastHoveredEnemy.current = undefined;
		}

		if (!hoveredEnemy) {
			return;
		}

		lastHoveredEnemy.current = hoveredEnemy;
		hoveredEnemy.highlight.OutlineTransparency = 0;
	}, [components, hoveredEnemy]);

	return <></>;
}

export function EnemyProvider({ userId, components }: { userId: string; components: Components }) {
	return (
		<>
			<SelectionProvider userId={userId} components={components} />
			<HoverProvider components={components} />
		</>
	);
}

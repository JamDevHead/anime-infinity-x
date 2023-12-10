import { Components } from "@flamework/components";
import { useSelectorCreator } from "@rbxts/react-reflex";
import { createPortal } from "@rbxts/react-roblox";
import Roact, { useEffect, useMemo, useRef } from "@rbxts/roact";
import { selectSelectedEnemiesByPlayerId } from "shared/store/enemy-selection";
import { Enemy } from "@/client/components/enemy-component";
import { EnemyAura } from "@/client/components/react/enemy-aura";
import { useRootSelector } from "@/client/store";
import { selectHoveredEnemy } from "@/client/store/enemy-hover";
import { getEnemyByUid } from "@/client/utils/enemies";

function SelectionProvider({ userId, components }: { userId: string; components: Components }) {
	const selectedEnemies = useSelectorCreator(selectSelectedEnemiesByPlayerId, userId);

	return (
		<>
			{selectedEnemies?.map((enemyUid) => {
				const enemy = getEnemyByUid(enemyUid, components);

				if (enemy) {
					return createPortal(<EnemyAura enemy={enemy} />, enemy.instance);
				} else {
					return <></>;
				}
			})}
		</>
	);
}

function HoverProvider({ components }: { components: Components }) {
	const hoveredEnemyUid = useRootSelector(selectHoveredEnemy);
	const lastHoveredEnemy = useRef<Enemy | undefined>();

	const hoveredEnemy = useMemo(() => {
		return hoveredEnemyUid !== undefined ? getEnemyByUid(hoveredEnemyUid, components) : undefined;
	}, [components, hoveredEnemyUid]);

	useEffect(() => {
		if (lastHoveredEnemy.current) {
			lastHoveredEnemy.current.highlight.OutlineTransparency = 1;
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

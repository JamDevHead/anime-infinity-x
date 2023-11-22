import Roact from "@rbxts/roact";
import { EnemyAura } from "@/client/components/react/enemy-aura";
import { createPortal } from "@rbxts/react-roblox";
import { useRootSelector } from "@/client/store";
import { selectHoveredEnemy, selectSelectedEnemies } from "@/client/store/enemy-selection";
import { EnemyHover } from "@/client/components/react/enemy-hover";

export function EnemyProvider() {
	const selectedEnemies = useRootSelector(selectSelectedEnemies);
	const hoveredEnemy = useRootSelector(selectHoveredEnemy);

	print("enemies", selectedEnemies);

	return (
		<>
			{selectedEnemies.map((enemy) => createPortal(<EnemyAura enemy={enemy} />, enemy.instance))}
			{hoveredEnemy && createPortal(<EnemyHover />, hoveredEnemy.instance)}
		</>
	);
}

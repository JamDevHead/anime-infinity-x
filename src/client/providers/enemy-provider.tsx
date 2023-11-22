import Roact from "@rbxts/roact";
import { EnemyAura } from "@/client/components/react/enemy-aura";
import { createPortal } from "@rbxts/react-roblox";
import { useRootSelector } from "@/client/store";
import { selectSelectedEnemies } from "@/client/store/enemy-selection";

export function EnemyProvider() {
	const enemies = useRootSelector(selectSelectedEnemies);

	print("enemies", enemies);

	return <>{enemies.map((enemy) => createPortal(<EnemyAura enemy={enemy} />, enemy.instance))}</>;
}

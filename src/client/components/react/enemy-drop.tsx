import Roact from "@rbxts/roact";
import { Enemy } from "@/client/components/enemy-component";
import { Drop } from "@/shared/store/enemies/drops";

export function EnemyDrop({ drop, enemy }: { drop: Drop; enemy: Enemy }) {
	const goal = enemy.root.Position;

	return <part Transparency={1} Size={Vector3.one} Position={enemy.root.Position} Anchored></part>;
}

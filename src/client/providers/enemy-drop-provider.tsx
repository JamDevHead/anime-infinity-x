import { useSelectorCreator } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { EnemyDrop } from "@/client/components/react/enemy-drop";
import { selectEnemiesDropsByOwnerId } from "@/shared/store/enemies/enemies-selectors";

export function EnemyDropProvider({ ownerId }: { ownerId: string }) {
	const drops = useSelectorCreator(selectEnemiesDropsByOwnerId, ownerId);

	return (
		<>
			{drops.map((drop) => (
				<EnemyDrop drop={drop} key={drop.id} />
			))}
		</>
	);
}

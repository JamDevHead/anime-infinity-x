import { useSelectorCreator } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { EnemyDrop } from "@/client/components/react/enemy-drop";
import { usePlayerId } from "@/client/ui/hooks/use-player-id";
import { selectEnemiesDropsByOwnerId } from "@/shared/store/enemies/enemies-selectors";

export function EnemyDropProvider() {
	const userId = usePlayerId();
	const drops = useSelectorCreator(selectEnemiesDropsByOwnerId, userId);

	return (
		<>
			{drops.map((drop) => (
				<EnemyDrop drop={drop} key={drop.id} />
			))}
		</>
	);
}

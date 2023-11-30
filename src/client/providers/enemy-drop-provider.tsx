import { useSelectorCreator } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { EnemyDrop } from "@/client/components/react/enemy-drop";
import { usePlayerId } from "@/client/ui/hooks/use-player-id";
import { SoundTracker } from "@/shared/lib/sound-tracker";
import { selectEnemiesDropsByOwnerId } from "@/shared/store/enemies/enemies-selectors";

export function EnemyDropProvider(props: { soundTracker: SoundTracker }) {
	const userId = usePlayerId();
	const drops = useSelectorCreator(selectEnemiesDropsByOwnerId, userId);

	return (
		<>
			{drops.map((drop) => (
				<EnemyDrop {...props} drop={drop} key={drop.id} />
			))}
		</>
	);
}

import { Components } from "@flamework/components";
import { useSelectorCreator } from "@rbxts/react-reflex";
import Roact from "@rbxts/roact";
import { EnemyDrop } from "@/client/components/react/enemy-drop";
import { getEnemyByUid } from "@/client/utils/enemies";
import { selectEnemiesDropsByOwnerId } from "@/shared/store/enemies/enemies-selectors";

export function EnemyDropProvider({ ownerId, components }: { ownerId: string; components: Components }) {
	const drops = useSelectorCreator(selectEnemiesDropsByOwnerId, ownerId);

	return (
		<>
			{drops.mapFiltered((drop) => {
				const enemy = getEnemyByUid(drop.enemyId, components);

				return enemy ? <EnemyDrop drop={drop} enemy={enemy} /> : undefined;
			})}
		</>
	);
}

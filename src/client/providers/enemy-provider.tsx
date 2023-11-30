import { useSelectorCreator } from "@rbxts/react-reflex";
import { createPortal } from "@rbxts/react-roblox";
import Roact, { useMemo } from "@rbxts/roact";
import { selectSelectedEnemiesByPlayerId } from "shared/store/enemy-selection";
import { EnemyAura } from "@/client/components/react/enemy-aura";
import { EnemyHover } from "@/client/components/react/enemy-hover";
import { useRootSelector } from "@/client/store";
import { selectHoveredEnemy } from "@/client/store/enemy-hover";
import { selectActivePlayerFighters } from "@/shared/store/players/fighters";
import { getEnemyModelByUid } from "@/shared/utils/enemies";

function SelectionProvider({ userId }: { userId: string }) {
	const selectedEnemies = useSelectorCreator(selectSelectedEnemiesByPlayerId, userId);
	const activeFighters = useSelectorCreator(selectActivePlayerFighters, userId);
	const activeFightersIsEmpty = useMemo(() => {
		print("active fighters changed", activeFighters.size());
		return activeFighters.size() === 0;
	}, [activeFighters]);

	return (
		<>
			{!activeFightersIsEmpty &&
				selectedEnemies?.map((enemyUid) => {
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

	const hoveredEnemy = useMemo(() => {
		return hoveredEnemyUid !== undefined && getEnemyModelByUid(hoveredEnemyUid);
	}, [hoveredEnemyUid]);

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

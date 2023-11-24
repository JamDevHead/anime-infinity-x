import { createProducer } from "@rbxts/reflex";

interface EnemyHoverSlice {
	hoveredEnemy?: string;
}

const initialState: EnemyHoverSlice = {};

export const enemyHoverSlice = createProducer(initialState, {
	setHoveredEnemy: (_, enemyUid: string) => ({
		hoveredEnemy: enemyUid,
	}),
	removeHoveredEnemy: () => ({
		hoveredEnemy: undefined,
	}),
});

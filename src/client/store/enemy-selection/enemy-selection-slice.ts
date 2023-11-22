import { createProducer } from "@rbxts/reflex";
import { Enemy } from "@/client/components/enemy";

interface EnemySelectionSlice {
	readonly enemies: Enemy[];
}

const initialState: EnemySelectionSlice = {
	enemies: [],
};

export const enemySelectionSlice = createProducer(initialState, {
	setSelectedEnemy: (state, enemy: Enemy) => ({
		enemies: [...state.enemies, enemy],
	}),
	removeSelectedEnemy: (state, enemyToRemove: Enemy) => ({
		enemies: state.enemies.filter((enemy) => enemy !== enemyToRemove),
	}),
});

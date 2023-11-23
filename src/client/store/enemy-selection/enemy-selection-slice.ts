import { createProducer } from "@rbxts/reflex";
import { Enemy } from "@/client/components/enemy";

interface EnemySelectionSlice {
	readonly enemies: Enemy[];
	hoveredEnemy?: Enemy;
}

const initialState: EnemySelectionSlice = {
	enemies: [],
};

export const enemySelectionSlice = createProducer(initialState, {
	setSelectedEnemy: (state, enemy: Enemy) => ({
		enemies: [...state.enemies, enemy],
		hoveredEnemy: undefined,
	}),
	removeSelectedEnemy: (state, enemyToRemove: Enemy) => ({
		enemies: state.enemies.filter((enemy) => enemy !== enemyToRemove),
	}),
	setHoveredEnemy: (state, enemy: Enemy) => {
		if (state.enemies.includes(enemy)) {
			return state;
		}

		return {
			...state,
			hoveredEnemy: enemy,
		};
	},
	removeHoveredEnemy: (state, enemyToRemove: Enemy) => {
		if (state.hoveredEnemy !== enemyToRemove) {
			return state;
		}

		return {
			...state,
			hoveredEnemy: undefined,
		};
	},
});

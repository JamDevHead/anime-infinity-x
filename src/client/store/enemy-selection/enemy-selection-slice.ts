import { createProducer } from "@rbxts/reflex";
import { EnemyComponent } from "@/shared/components/enemy-component";

interface EnemySelectionSlice {
	readonly enemies: EnemyComponent[];
	hoveredEnemy?: EnemyComponent;
}

const initialState: EnemySelectionSlice = {
	enemies: [],
};

export const enemySelectionSlice = createProducer(initialState, {
	setSelectedEnemy: (state, enemy: EnemyComponent) => ({
		enemies: [...state.enemies, enemy],
		hoveredEnemy: undefined,
	}),
	removeSelectedEnemy: (state, enemyToRemove: EnemyComponent) => ({
		enemies: state.enemies.filter((enemy) => enemy !== enemyToRemove),
	}),
	setHoveredEnemy: (state, enemy: EnemyComponent) => {
		if (state.enemies.includes(enemy)) {
			return state;
		}

		return {
			...state,
			hoveredEnemy: enemy,
		};
	},
	removeHoveredEnemy: (state, enemyToRemove: EnemyComponent) => {
		if (state.hoveredEnemy !== enemyToRemove) {
			return state;
		}

		return {
			...state,
			hoveredEnemy: undefined,
		};
	},
});

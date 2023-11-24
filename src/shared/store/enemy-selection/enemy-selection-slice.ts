import { createProducer } from "@rbxts/reflex";

interface EnemySelectionSlice {
	readonly [playerId: string]: string[] | undefined; // PlayerId -> EnemiesUuid[]
}

const initialState: EnemySelectionSlice = {};

export const enemySelectionSlice = createProducer(initialState, {
	setSelectedEnemy: (state, playerId: string, enemyUid: string) => {
		const enemies = state[playerId] ?? [];

		if (enemies.includes(enemyUid)) {
			return state;
		}

		return {
			...state,
			[playerId]: [...enemies, enemyUid],
		};
	},
	removeSelectedEnemy: (state, playerId: string, enemyUid: string) => {
		const enemies = state[playerId] ?? [];

		if (!enemies.includes(enemyUid)) {
			return state;
		}

		return {
			...state,
			[playerId]: enemies.filter((uid) => uid !== enemyUid),
		};
	},
});

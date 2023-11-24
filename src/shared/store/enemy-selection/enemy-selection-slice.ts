import { createProducer } from "@rbxts/reflex";

interface EnemySelectionSlice {
	readonly [playerId: string]: string[]; // PlayerId -> EnemiesUuid[]
}

const initialState: EnemySelectionSlice = {};

export const enemySelectionSlice = createProducer(initialState, {
	setSelectedEnemy: (state, playerId: string, enemyUid: string) => ({
		[playerId]: [...(state[playerId] ?? []), enemyUid],
	}),
	removeSelectedEnemy: (state, playerId: string, enemyUid: string) => ({
		[playerId]: (state[playerId] ?? []).filter((otherEnemyUid) => otherEnemyUid !== enemyUid),
	}),
});

import { createProducer } from "@rbxts/reflex";

interface HealthState {
	readonly [enemyId: string]: number | undefined;
}

const initialState: HealthState = {};

export const healthSlice = createProducer(initialState, {
	addEnemy: (state, enemyId: string) => ({
		...state,
		[enemyId]: 0,
	}),
	removeEnemy: (state, enemyId: string) => ({
		...state,
		[enemyId]: undefined,
	}),
});

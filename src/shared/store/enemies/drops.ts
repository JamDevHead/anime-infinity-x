import { createProducer } from "@rbxts/reflex";

export interface DropsState {
	readonly [enemyId: string]: Drop[] | undefined;
}

export interface Drop {
	readonly id: string;
	readonly quantity: number;
}

const initialState: DropsState = {};

export const dropsSlice = createProducer(initialState, {
	addEnemy: (state, enemyId: string) => ({
		...state,
		[enemyId]: [],
	}),
	removeEnemy: (state, enemyId: string) => ({
		...state,
		[enemyId]: undefined,
	}),
	addDrop: (state, enemyId: string, drop: Drop) => {
		const drops = state[enemyId] ?? [];

		return {
			...state,
			[enemyId]: [...drops, drop],
		};
	},
	removeDrop: (state, enemyId: string, drop: Drop) => {
		const drops = state[enemyId] ?? [];

		return {
			...state,
			[enemyId]: drops.filter((d) => d.id !== drop.id),
		};
	},
});

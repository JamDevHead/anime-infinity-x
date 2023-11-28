import { createProducer } from "@rbxts/reflex";

export type DropsState = Drop[];

export interface Drop {
	readonly enemyId: string;
	readonly owner: string;
	readonly id: string;
	readonly quantity: number;
}

const initialState: DropsState = [];

export const dropsSlice = createProducer(initialState, {
	addDrop: (state, enemyId: string, drop: Omit<Drop, "enemyId">) => [...state, { ...drop, enemyId }],
	removeDrops: (state, enemyId: string) => state.filter((drop) => drop.enemyId !== enemyId),
});

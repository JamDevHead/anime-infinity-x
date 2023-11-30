import { createProducer } from "@rbxts/reflex";

export type DropsState = Drop[];

export interface Drop {
	readonly enemyId: string;
	readonly owner: string;
	readonly id: string;
	readonly type: string;
	readonly quantity: number;
	readonly origin: Vector3;
}

const initialState: DropsState = [];

export const dropsSlice = createProducer(initialState, {
	addDrop: (state, enemyId: string, drop: Omit<Drop, "enemyId">) => [...state, { ...drop, enemyId }],
	removeDrop: (state, dropId: string) => state.filter((drop) => drop.id !== dropId),
});

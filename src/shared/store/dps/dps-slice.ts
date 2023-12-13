import { createProducer } from "@rbxts/reflex";

interface DpsState {
	readonly [playerId: string]: number | undefined;
}

const initialState: DpsState = {};

export const dpsSlice = createProducer(initialState, {
	setPlayerDps: (state, playerId: string, dps: number) => ({
		...state,
		[playerId]: dps,
	}),

	removePlayerDps: (state, playerId: string) => ({
		...state,
		[playerId]: undefined,
	}),
});

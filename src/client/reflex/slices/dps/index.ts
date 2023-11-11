import { createProducer } from "@rbxts/reflex";

interface DpsState {
	dps: number;
}

const initialState: DpsState = {
	dps: 0,
};

export const dpsSlice = createProducer(initialState, {
	setDps: (state, dps: number) => ({
		...state,
		dps,
	}),
	addDps: (state, dps: number) => ({
		...state,
		dps: state.dps + dps,
	}),
	subtractDps: (state, dps: number) => ({
		...state,
		dps: state.dps - dps,
	}),
});

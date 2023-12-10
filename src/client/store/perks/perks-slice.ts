import { createProducer } from "@rbxts/reflex";

interface PerksState {
	autofarm: boolean;
	autoclick: boolean;
}

const initialState: PerksState = {
	autofarm: false,
	autoclick: false,
};

export const perksSlice = createProducer(initialState, {
	toggleAutofarm: (state) => ({
		...state,
		autofarm: !state.autofarm,
	}),
	toggleAutoclick: (state) => ({
		...state,
		autoclick: !state.autoclick,
	}),
});

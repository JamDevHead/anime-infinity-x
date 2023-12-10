import { createProducer } from "@rbxts/reflex";

interface PerksState {
	autofarm: boolean;
}

const initialState: PerksState = {
	autofarm: false,
};

export const perksSlice = createProducer(initialState, {
	toggleAutofarm: (state) => ({
		...state,
		autofarm: !state.autofarm,
	}),
});

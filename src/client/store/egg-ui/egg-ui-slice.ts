import { createProducer } from "@rbxts/reflex";

interface EggUiState {
	opened: boolean;
}

const initialState: EggUiState = {
	opened: false,
};

export const eggUiSlice = createProducer(initialState, {
	setEggOpen: (state, opened: boolean) => ({
		...state,
		opened,
	}),
	toggleEggOpen: (state) => ({
		...state,
		opened: !state.opened,
	}),
});

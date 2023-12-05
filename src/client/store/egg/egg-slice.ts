import { createProducer } from "@rbxts/reflex";

interface EggState {
	opened: boolean;
}

const initialState: EggState = {
	opened: false,
};

export const eggSlice = createProducer(initialState, {
	setEggOpen: (state, opened: boolean) => ({
		...state,
		opened,
	}),
	toggleEggOpen: (state) => ({
		...state,
		opened: !state.opened,
	}),
});

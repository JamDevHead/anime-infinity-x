import { createProducer } from "@rbxts/reflex";

interface BlurState {
	size: number;
}

const initialState: BlurState = {
	size: 0,
};

export const blurSlice = createProducer(initialState, {
	setBlur: (state, size: number) => ({
		...state,
		size: size,
	}),
	addBlur: (state, size: number) => ({
		...state,
		size: state.size + size,
	}),
	subtractBlur: (state, size: number) => ({
		...state,
		size: state.size - size,
	}),
});

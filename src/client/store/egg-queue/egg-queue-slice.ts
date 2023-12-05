import { createProducer } from "@rbxts/reflex";

interface EggQueueState {
	queue: string[];
}

const initialState: EggQueueState = {
	queue: [],
};

export const eggQueueSlice = createProducer(initialState, {
	addToEggQueue: (state, eggZone: string) => ({
		...state,
		queue: [...state.queue, eggZone],
	}),

	removeFromEggQueue: (state, eggZone: string) => ({
		...state,
		queue: state.queue.filter((queuedEgg) => queuedEgg !== eggZone),
	}),
});

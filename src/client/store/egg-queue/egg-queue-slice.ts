import { createProducer } from "@rbxts/reflex";
import { PlayerFighter } from "@/shared/store/players";

interface EggQueueState {
	queue: PlayerFighter[];
	eggPurchases: PlayerFighter[];
}

const initialState: EggQueueState = {
	queue: [],
	eggPurchases: [],
};

export const eggQueueSlice = createProducer(initialState, {
	addToEggQueue: (state, fighter: PlayerFighter) => ({
		...state,
		queue: [...state.queue, fighter],
	}),

	removeFromEggQueue: (state, fighter: PlayerFighter) => ({
		...state,
		queue: state.queue.filter((fighterInQueue) => fighterInQueue !== fighter),
	}),

	addEggPurchase: (state, fighter: PlayerFighter) => ({
		...state,
		eggPurchases: [...state.eggPurchases, fighter],
	}),

	removeEggPurchase: (state, fighter: PlayerFighter) => ({
		...state,
		eggPurchases: state.eggPurchases.filter((fighterInQueue) => fighterInQueue.uid !== fighter.uid),
	}),
});

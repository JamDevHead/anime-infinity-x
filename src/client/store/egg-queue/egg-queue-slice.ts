import { createProducer } from "@rbxts/reflex";
import { PlayerFighter } from "@/shared/store/players";

interface EggQueueState {
	queue: string[];
	eggPurchases: PlayerFighter[];
}

const initialState: EggQueueState = {
	queue: [],
	eggPurchases: [],
};

export const eggQueueSlice = createProducer(initialState, {
	addToEggQueue: (state, eggZone: string) => ({
		...state,
		queue: [...state.queue, eggZone],
	}),

	removeFromEggQueue: (state, eggZone: string) => ({
		...state,
		queue: state.queue.filter((zoneInQueue) => zoneInQueue !== eggZone),
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

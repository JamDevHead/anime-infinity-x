import { createProducer } from "@rbxts/reflex";
import { PlayerFighter } from "@/shared/store/players";

type FighterWithZone = PlayerFighter & { eggZone: string };

interface EggQueueState {
	queue: FighterWithZone[];
	eggPurchases: FighterWithZone[];
}

const initialState: EggQueueState = {
	queue: [],
	eggPurchases: [],
};

export const eggQueueSlice = createProducer(initialState, {
	addToEggQueue: (state, fighter: PlayerFighter, eggZone: PlayerFighter["zone"]) => ({
		...state,
		queue: [...state.queue, { ...fighter, eggZone }],
	}),

	removeFromEggQueue: (state, fighter: PlayerFighter) => ({
		...state,
		queue: state.queue.filter((fighterInQueue) => fighterInQueue.uid !== fighter.uid),
	}),

	addEggPurchase: (state, fighter: PlayerFighter, eggZone: PlayerFighter["zone"]) => ({
		...state,
		eggPurchases: [...state.eggPurchases, { ...fighter, eggZone }],
	}),

	removeEggPurchase: (state, fighter: PlayerFighter) => ({
		...state,
		eggPurchases: state.eggPurchases.filter((fighterInQueue) => fighterInQueue.uid !== fighter.uid),
	}),
});

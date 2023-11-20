import { combineProducers, InferState } from "@rbxts/reflex";
import { broadcasterMiddleware } from "@/server/store/middleware/broadcaster";
import { slices } from "@/shared/store";

export type RootState = InferState<typeof store>;

export function createStore() {
	const store = combineProducers({
		...slices,
	});

	store.applyMiddleware(broadcasterMiddleware());

	return store;
}

export const store = createStore();

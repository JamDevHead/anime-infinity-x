import { combineProducers, InferState } from "@rbxts/reflex";
import { broadcasterMiddleware } from "@/server/store/middleware/broadcaster";
import { slices } from "@/shared/store";
import { profilerMiddleware } from "@/shared/store/middleware/profile-middleware";

export type RootState = InferState<typeof store>;

export function createStore() {
	const store = combineProducers({
		...slices,
	});

	store.applyMiddleware(profilerMiddleware, broadcasterMiddleware());

	return store;
}

export const store = createStore();

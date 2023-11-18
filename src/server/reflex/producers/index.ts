import { combineProducers, InferState } from "@rbxts/reflex";
import { slices } from "shared/reflex/slices";
import { broadcasterMiddleware } from "@/server/reflex/middleware/broadcaster";

export type RootState = InferState<typeof producer>;

export function createProducer() {
	const producer = combineProducers({
		...slices,
	});

	producer.applyMiddleware(broadcasterMiddleware());

	return producer;
}

export const producer = createProducer();

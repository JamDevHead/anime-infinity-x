import { combineProducers, InferState } from "@rbxts/reflex";
import { slices } from "shared/reflex/slices";

export type RootProducer = typeof producer;
export type RootState = InferState<RootProducer>;

export const producer = combineProducers({
	...slices,
});

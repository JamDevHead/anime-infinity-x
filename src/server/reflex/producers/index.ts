import { combineProducers, InferState } from "@rbxts/reflex";
import { slices } from "shared/reflex/slices";

export type RootState = InferState<typeof producer>;

export const producer = combineProducers({
	...slices,
});

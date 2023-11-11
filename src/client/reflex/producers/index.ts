import { useProducer, UseProducerHook, useSelector, UseSelectorHook } from "@rbxts/react-reflex";
import { combineProducers, InferState } from "@rbxts/reflex";
import { slices } from "shared/reflex/slices";
import { dpsSlice } from "@/client/reflex/slices/dps";

export type RootProducer = typeof producer;
export type RootState = InferState<RootProducer>;

export const producer = combineProducers({
	...slices,
	dps: dpsSlice,
});

export const useRootProducer: UseProducerHook<RootProducer> = useProducer;
export const useRootSelector: UseSelectorHook<RootProducer> = useSelector;

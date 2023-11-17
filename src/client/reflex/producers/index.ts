import { useProducer, UseProducerHook, useSelector, UseSelectorHook } from "@rbxts/react-reflex";
import { combineProducers, InferState } from "@rbxts/reflex";
import { slices } from "shared/reflex/slices";
import { devToolsMiddleware } from "@/client/reflex/producers/middlewares/devtools";
import { clientSlices } from "@/client/reflex/slices";

export type RootProducer = typeof producer;
export type RootState = InferState<RootProducer>;

export const producer = combineProducers({
	...slices,
	...clientSlices,
}).applyMiddleware(devToolsMiddleware);

export const useRootProducer: UseProducerHook<RootProducer> = useProducer;
export const useRootSelector: UseSelectorHook<RootProducer> = useSelector;

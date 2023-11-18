import { useProducer, UseProducerHook, useSelector, UseSelectorHook } from "@rbxts/react-reflex";
import { combineProducers, InferState } from "@rbxts/reflex";
import { slices } from "shared/reflex/slices";
import { devToolsMiddleware } from "@/client/reflex/middleware/devtools";
import { receiverMiddleware } from "@/client/reflex/middleware/receiver";
import { clientSlices } from "@/client/reflex/slices";

export type RootProducer = typeof producer;
export type RootState = InferState<RootProducer>;

export function createProducer() {
	const producer = combineProducers({
		...slices,
		...clientSlices,
	});

	producer.applyMiddleware(devToolsMiddleware, receiverMiddleware(producer));

	return producer;
}

export const producer = createProducer();

export const useRootProducer: UseProducerHook<RootProducer> = useProducer;
export const useRootSelector: UseSelectorHook<RootProducer> = useSelector;

import { useProducer, UseProducerHook, useSelector, UseSelectorHook } from "@rbxts/react-reflex";
import { combineProducers, InferState } from "@rbxts/reflex";
import { dpsSlice } from "./dps";
import { hudSlice } from "./hud";
import { devToolsMiddleware } from "./middleware/devtools";
import { receiverMiddleware } from "./middleware/receiver";
import { settingsSlice } from "./settings";
import { windowSlice } from "./window";
import { inventorySlice } from "@/client/store/inventory";
import { slices } from "@/shared/store";

export type RootStore = typeof store;
export type RootState = InferState<RootStore>;

export function createStore() {
	const store = combineProducers({
		...slices,
		dps: dpsSlice,
		hud: hudSlice,
		settings: settingsSlice,
		window: windowSlice,
		inventory: inventorySlice,
	});

	store.applyMiddleware(devToolsMiddleware, receiverMiddleware(store));

	return store;
}

export const store = createStore();

export const useRootStore: UseProducerHook<RootStore> = useProducer;
export const useRootSelector: UseSelectorHook<RootStore> = useSelector;

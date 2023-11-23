import { useProducer, UseProducerHook, useSelector, UseSelectorHook } from "@rbxts/react-reflex";
import { combineProducers, InferState } from "@rbxts/reflex";
import { dpsSlice } from "./dps";
import { hudSlice } from "./hud";
import { devToolsMiddleware } from "./middleware/devtools";
import { receiverMiddleware } from "./middleware/receiver";
import { settingsSlice } from "./settings";
import { windowSlice } from "./window";
import { slices } from "@/shared/store";
import { enemySelectionSlice } from "@/client/store/enemy-selection";
import { fighterTargetSlice } from "client/store/fighter-target";

export type RootStore = typeof store;
export type RootState = InferState<RootStore>;

export function createStore() {
	const store = combineProducers({
		...slices,
		dps: dpsSlice,
		hud: hudSlice,
		settings: settingsSlice,
		window: windowSlice,
		enemySelection: enemySelectionSlice,
		enemyTarget: fighterTargetSlice,
	});

	store.applyMiddleware(devToolsMiddleware, receiverMiddleware(store));

	return store;
}

export const store = createStore();

export const useRootStore: UseProducerHook<RootStore> = useProducer;
export const useRootSelector: UseSelectorHook<RootStore> = useSelector;

import { useProducer, UseProducerHook, useSelector, UseSelectorHook } from "@rbxts/react-reflex";
import { combineProducers, InferState } from "@rbxts/reflex";
import { eggUiSlice } from "client/store/egg-ui";
import { dpsSlice } from "./dps";
import { hudSlice } from "./hud";
import { devToolsMiddleware } from "./middleware/devtools";
import { receiverMiddleware } from "./middleware/receiver";
import { windowSlice } from "./window";
import { blurSlice } from "@/client/store/blur";
import { eggQueueSlice } from "@/client/store/egg-queue";
import { enemyHoverSlice } from "@/client/store/enemy-hover";
import { inventorySlice } from "@/client/store/inventory";
import { loadingSlice } from "@/client/store/loading";
import { perksSlice } from "@/client/store/perks";
import { portalSlice } from "@/client/store/portal";
import { clientSettingsSlice } from "@/client/store/settings/client-settings-slice";
import { slices } from "@/shared/store";
import { profilerMiddleware } from "@/shared/store/middleware/profile-middleware";

export type RootStore = typeof store;
export type RootState = InferState<RootStore>;

export function createStore() {
	const store = combineProducers({
		...slices,
		dps: dpsSlice,
		hud: hudSlice,
		clientSettings: clientSettingsSlice,
		window: windowSlice,
		inventory: inventorySlice,
		enemyHover: enemyHoverSlice,
		loading: loadingSlice,
		blur: blurSlice,
		portal: portalSlice,
		eggUi: eggUiSlice,
		eggQueue: eggQueueSlice,
		perks: perksSlice,
	});

	store.applyMiddleware(profilerMiddleware, devToolsMiddleware, receiverMiddleware(store));

	return store;
}

export const store = createStore();

export const useRootStore: UseProducerHook<RootStore> = useProducer;
export const useRootSelector: UseSelectorHook<RootStore> = useSelector;

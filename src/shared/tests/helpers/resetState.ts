import { Producer } from "@rbxts/reflex";

export function resetStore(store: Producer) {
	store.flush(); // flush any pending action
	store.resetState(); // reset state
	store.flush(); // flush reset action
}

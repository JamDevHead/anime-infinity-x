import { combineProducers } from "@rbxts/reflex";
import { balanceSlice } from "@/shared/reflex/slices/players/balance";
import { fightersSlice } from "@/shared/reflex/slices/players/fighters";
import { zonesSlice } from "@/shared/reflex/slices/players/zones";

export const playersSlice = combineProducers({
	balance: balanceSlice,
	zones: zonesSlice,
	fighters: fightersSlice,
});

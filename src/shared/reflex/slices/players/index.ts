import { combineProducers } from "@rbxts/reflex";
import { balanceSlice } from "@/shared/reflex/slices/players/balance";

export const playersSlice = combineProducers({
	balance: balanceSlice,
});

import { combineProducers } from "@rbxts/reflex";
import { balanceSlice } from "@/shared/reflex/slices/players/balance";
import { boostsSlice } from "@/shared/reflex/slices/players/boosts";
import { fightersSlice } from "@/shared/reflex/slices/players/fighters";
import { missionsSlice } from "@/shared/reflex/slices/players/missions";
import { zonesSlice } from "@/shared/reflex/slices/players/zones";

export const playersSlice = combineProducers({
	balance: balanceSlice,
	zones: zonesSlice,
	fighters: fightersSlice,
	missions: missionsSlice,
	boosts: boostsSlice,
});

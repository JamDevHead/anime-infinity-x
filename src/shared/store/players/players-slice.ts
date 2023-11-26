import { combineProducers } from "@rbxts/reflex";
import { balanceSlice } from "@/shared/store/players/balance";
import { boostsSlice } from "@/shared/store/players/boosts";
import { fightersSlice } from "@/shared/store/players/fighters";
import { inventorySlice } from "@/shared/store/players/inventory";
import { missionsSlice } from "@/shared/store/players/missions";
import { zonesSlice } from "@/shared/store/players/zones";

export const playersSlice = combineProducers({
	balance: balanceSlice,
	zones: zonesSlice,
	fighters: fightersSlice,
	missions: missionsSlice,
	boosts: boostsSlice,
	inventory: inventorySlice,
});

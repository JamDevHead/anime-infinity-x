import { filterBoosts } from "./boosts-filter";
import { filterFighters } from "./fighters-filter";
import { filterIndex } from "./index-filter";
import { filterInfo } from "./info-filter";
import { filterInventory } from "./inventory-filter";
import { filterMissions } from "./missions-filter";
import { filterSettings } from "./settings-filter";
import { filterZones } from "./zones-filter";
import { FilterState } from "@/server/store/filters/filter";
import { filterBalance } from "@/server/store/filters/state/players-filters/balance-filter";

export const filterPlayers: FilterState = (player, state) => {
	return {
		...state,
		players: {
			...state.players,
			missions: filterMissions(player, state.players.missions),
			inventory: filterInventory(player, state.players.inventory),
			settings: filterSettings(player, state.players.settings),
			zones: filterZones(player, state.players.zones),
			info: filterInfo(player, state.players.info),
			index: filterIndex(player, state.players.index),
			fighters: filterFighters(player, state.players.fighters),
			boosts: filterBoosts(player, state.players.boosts),
			balance: filterBalance(player, state.players.balance),
		},
	};
};

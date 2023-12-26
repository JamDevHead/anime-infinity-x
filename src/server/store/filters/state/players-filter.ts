import { FilterState } from "@/server/store/filters/filter";
import { filterMissions } from "@/server/store/filters/state/missions-filter";
import { filterInventory } from "@/server/store/filters/state/inventory-filter";
import { filterSettings } from "@/server/store/filters/state/settings-filter";
import { filterZones } from "@/server/store/filters/state/zones-filter";
import { filterIndex } from "@/server/store/filters/state/index-filter";
import { filterInfo } from "@/server/store/filters/state/info-filter";
import { filterFighters } from "@/server/store/filters/state/fighters-filter";
import { filterBoosts } from "@/server/store/filters/state/boosts-filter";

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
		},
	};
};

import { FilterState } from "@/server/store/filters/filter";
import { filterMissions } from "@/server/store/filters/state/missions-filter";
import { filterSettings } from "@/server/store/filters/state/settings-filter";
import { filterZones } from "@/server/store/filters/state/zones-filter";
import { filterInventory } from "@/server/store/filters/state/inventory-filter";

export const stateFilters: FilterState[] = [filterZones, filterSettings, filterMissions, filterInventory];

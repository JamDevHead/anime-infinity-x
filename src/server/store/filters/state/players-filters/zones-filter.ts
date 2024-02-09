import { simpleFilter } from "@/server/store/filters/state/simple-filter";
import { ZonesState } from "@/shared/store/players/zones";

export const filterZones = simpleFilter<ZonesState>();

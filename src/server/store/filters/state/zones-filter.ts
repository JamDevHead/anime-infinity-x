import { simpleFilter } from "@/server/store/filters/state/index";
import { ZonesState } from "@/shared/store/players/zones";

export const filterZones = simpleFilter<ZonesState>();

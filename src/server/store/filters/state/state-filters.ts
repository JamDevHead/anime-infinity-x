import { FilterState } from "@/server/store/filters/filter";
import { filterPlayers } from "@/server/store/filters/state/players-filters";

export const stateFilters: FilterState[] = [filterPlayers];

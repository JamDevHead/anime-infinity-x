import { simpleFilter } from "@/server/store/filters/state/simple-filter";
import { BoostsState } from "@/shared/store/players/boosts";

export const filterBoosts = simpleFilter<BoostsState>();

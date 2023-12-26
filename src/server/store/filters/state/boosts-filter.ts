import { simpleFilter } from "@/server/store/filters/state/index";
import { BoostsState } from "@/shared/store/players/boosts";

export const filterBoosts = simpleFilter<BoostsState>();

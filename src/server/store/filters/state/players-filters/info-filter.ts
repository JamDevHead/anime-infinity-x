import { simpleFilter } from "@/server/store/filters/state/simple-filter";
import { InfoState } from "@/shared/store/players/info";

export const filterInfo = simpleFilter<InfoState>();

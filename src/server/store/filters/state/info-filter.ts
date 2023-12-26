import { simpleFilter } from "@/server/store/filters/state/index";
import { InfoState } from "@/shared/store/players/info";

export const filterInfo = simpleFilter<InfoState>();

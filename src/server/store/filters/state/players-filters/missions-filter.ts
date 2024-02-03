import { simpleFilter } from "@/server/store/filters/state/simple-filter";
import { MissionsState } from "@/shared/store/players/missions";

export const filterMissions = simpleFilter<MissionsState>();

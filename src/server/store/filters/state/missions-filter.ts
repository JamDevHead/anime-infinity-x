import { MissionsState } from "@/shared/store/players/missions";
import { simpleFilter } from "@/server/store/filters/state/index";

export const filterMissions = simpleFilter<MissionsState>();

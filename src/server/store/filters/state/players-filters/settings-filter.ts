import { simpleFilter } from "@/server/store/filters/state/simple-filter";
import { SettingsState } from "@/shared/store/players/settings";

export const filterSettings = simpleFilter<SettingsState>();

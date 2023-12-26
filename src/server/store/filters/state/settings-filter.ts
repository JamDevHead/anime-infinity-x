import { simpleFilter } from "@/server/store/filters/state/index";
import { SettingsState } from "@/shared/store/players/settings";

export const filterSettings = simpleFilter<SettingsState>();

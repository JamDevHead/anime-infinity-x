import { simpleFilter } from "@/server/store/filters/state/simple-filter";
import { BalanceState } from "@/shared/store/players/balance";

export const filterBalance = simpleFilter<BalanceState>();

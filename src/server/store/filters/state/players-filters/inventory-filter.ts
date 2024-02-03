import { simpleFilter } from "@/server/store/filters/state/simple-filter";
import { InventoryState } from "@/shared/store/players/inventory";

export const filterInventory = simpleFilter<InventoryState>();

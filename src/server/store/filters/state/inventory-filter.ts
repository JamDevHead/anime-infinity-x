import { InventoryState } from "@/shared/store/players/inventory";
import { simpleFilter } from "@/server/store/filters/state/index";

export const filterInventory = simpleFilter<InventoryState>();

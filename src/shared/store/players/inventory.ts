import { createProducer } from "@rbxts/reflex";
import { PlayerData, PlayerInventory } from "@/shared/store/players/players-types";

export interface InventoryState {
	readonly [playerId: string]: PlayerInventory | undefined;
}

const initialState: InventoryState = {};

export const inventorySlice = createProducer(initialState, {
	loadPlayerData: (state, playerId: string, data: PlayerData) => ({
		...state,
		[playerId]: data.inventory,
	}),

	unloadPlayerData: (state, playerId: string) => ({
		...state,
		[playerId]: undefined,
	}),
});

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

	addInventorySlot: (state, playerId: string, quantity: number) => {
		const playerInventory = state[playerId];
		if (playerInventory === undefined) return state;

		return {
			...state,
			[playerId]: {
				...playerInventory,
				maxStorage: playerInventory.maxStorage + quantity,
			},
		};
	},

	removeInventorySlot: (state, playerId: string, quantity: number) => {
		const playerInventory = state[playerId];
		if (playerInventory === undefined) return state;

		return {
			...state,
			[playerId]: {
				...playerInventory,
				maxStorage: playerInventory.maxStorage - quantity,
			},
		};
	},

	setInventorySlot: (state, playerId: string, quantity: number) => {
		const playerInventory = state[playerId];
		if (playerInventory === undefined) return state;

		return {
			...state,
			[playerId]: {
				...playerInventory,
				maxStorage: quantity,
			},
		};
	},

	addFighterSlot: (state, playerId: string, quantity: number) => {
		const playerInventory = state[playerId];
		if (playerInventory === undefined) return state;

		return {
			...state,
			[playerId]: {
				...playerInventory,
				maxFighters: playerInventory.maxFighters + quantity,
			},
		};
	},

	removeFighterSlot: (state, playerId: string, quantity: number) => {
		const playerInventory = state[playerId];
		if (playerInventory === undefined) return state;

		return {
			...state,
			[playerId]: {
				...playerInventory,
				maxFighters: playerInventory.maxFighters - quantity,
			},
		};
	},

	setFighterSlot: (state, playerId: string, quantity: number) => {
		const playerInventory = state[playerId];
		if (playerInventory === undefined) return state;

		return {
			...state,
			[playerId]: {
				...playerInventory,
				maxFighters: quantity,
			},
		};
	},
});

import { createProducer } from "@rbxts/reflex";

type InventorySlice = {
	openedContextMenu?: boolean;
	menuPosition?: Vector2;
	selectedItem?: string;
};

const initialState: InventorySlice = {
	openedContextMenu: false,
	menuPosition: new Vector2(0, 0),
};

export const inventorySlice = createProducer(initialState, {
	setInventoryOpenedMenu: (state, activeMenu: boolean) => {
		return {
			...state,
			openedContextMenu: activeMenu,
		};
	},
	setInventoryMenuPosition: (state, menuPosition: Vector2) => {
		return {
			...state,
			menuPosition,
		};
	},
	setInventorySelectedItem: (state, selectedItem: string) => {
		return {
			...state,
			selectedItem,
		};
	},
	resetInventorySlice: () => {
		return initialState;
	},
});

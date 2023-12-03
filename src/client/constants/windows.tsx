import { Window } from "@/@types/models/window";

export const Windows: Record<string, Window> = {
	codes: {
		title: "Codes",
	},
	settings: {
		title: "Settings",
	},
	inventory: {
		title: "Inventory",
		size: UDim2.fromScale(0.8, 0.8),
	},
	teleport: {
		title: "Teleport",
	},
	chooseFighter: {
		title: "Choose Fighter",
		size: UDim2.fromScale(0.6, 0.6),
	},
};

export type WindowName = keyof typeof Windows;

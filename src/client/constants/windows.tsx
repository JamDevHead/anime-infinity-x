import { Window } from "@/@types/models/window";

export const Windows: Record<string, Window> = {
	codes: {
		title: "Codes",
	},
	settings: {
		title: "Settings",
	},
};

export type WindowName = keyof typeof Windows;

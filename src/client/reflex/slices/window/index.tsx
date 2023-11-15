import { createProducer } from "@rbxts/reflex";
import { WindowName } from "@/client/constants/windows";

type WindowSlice = {
	currentWindow?: WindowName;
	visible?: boolean;
};

const initialState: WindowSlice = {
	currentWindow: "settings",
	visible: true,
};

export const windowSlice = createProducer(initialState, {
	setWindowVisible: (state, window: string, visible: boolean) => ({
		...state,
		currentWindow: window,
		visible,
	}),
	toggleWindowVisible: (state, window: string) => ({
		...state,
		currentWindow: window,
		visible: !state.visible,
	}),
	setVisibility: (state, visible: boolean) => ({
		...state,
		visible,
	}),
});

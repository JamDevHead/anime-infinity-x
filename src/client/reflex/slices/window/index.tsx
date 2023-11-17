import { createProducer } from "@rbxts/reflex";
import { WindowName } from "@/client/constants/windows";

type WindowSlice = {
	currentWindow?: WindowName;
	visible?: boolean;
};

const initialState: WindowSlice = {
	visible: false,
};

export const windowSlice = createProducer(initialState, {
	setWindowVisible: (state, window: string, visible: boolean) => ({
		...state,
		currentWindow: window,
		visible,
	}),
	setCurrentWindow: (state, window: string) => ({
		...state,
		currentWindow: window,
	}),
	toggleWindowVisible: (state, window: string) => ({
		...state,
		currentWindow: window,
		visible: state.currentWindow === window ? !state.visible : true,
	}),
	setVisibility: (state, visible: boolean) => ({
		...state,
		visible,
	}),
});

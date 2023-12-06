import { createProducer } from "@rbxts/reflex";

type PortalState = {
	visible: boolean;
};

const initialState: PortalState = {
	visible: false,
};

export const portalSlice = createProducer(initialState, {
	setPortalVisible: (state, visible: boolean) => ({
		...state,
		visible,
	}),
	togglePortalVisible: (state) => ({
		...state,
		visible: !state.visible,
	}),
});

import { createProducer } from "@rbxts/reflex";

type HudState = {
	missionVisible: boolean;
	visible: boolean;
};

const initialState: HudState = {
	missionVisible: false,
	visible: true,
};

export const hudSlice = createProducer(initialState, {
	setHudVisible: (state, visible: boolean) => ({
		...state,
		visible,
	}),
	toggleHudVisible: (state) => ({
		...state,
		visible: !state.visible,
	}),

	setMissionVisible: (state, visible: boolean) => ({
		...state,
		missionVisible: visible,
	}),
	toggleMissionVisible: (state) => ({
		...state,
		missionVisible: !state.missionVisible,
	}),
});

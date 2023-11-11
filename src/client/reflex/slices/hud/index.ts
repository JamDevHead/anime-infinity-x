import { createProducer } from "@rbxts/reflex";

type HudState = {
	missionVisible: boolean;
};

const initialState: HudState = {
	missionVisible: false,
};

export const hudSlice = createProducer(initialState, {
	setMissionVisible: (state, visible: boolean) => ({
		...state,
		missionVisible: visible,
	}),
	toggleMissionVisible: (state) => ({
		...state,
		missionVisible: !state.missionVisible,
	}),
});

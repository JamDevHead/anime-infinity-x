import { createProducer } from "@rbxts/reflex";

interface FighterTargetSlice {
	[uid: string]: string | undefined;
}

const initialState: FighterTargetSlice = {};

export const fighterTargetSlice = createProducer(initialState, {
	setFighterTarget: (state, fighterUid: string, targetUid: string) => ({
		...state,
		[fighterUid]: targetUid,
	}),
	removeFighterTarget: (state, fighterUid: string) => ({
		...state,
		[fighterUid]: undefined,
	}),
});

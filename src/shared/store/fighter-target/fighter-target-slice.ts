import { createProducer } from "@rbxts/reflex";

export interface FighterTargetSlice {
	readonly [fighterUid: string]: string | undefined;
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

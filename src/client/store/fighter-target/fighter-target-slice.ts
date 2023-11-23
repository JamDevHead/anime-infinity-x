import { createProducer } from "@rbxts/reflex";
import { Enemy } from "@/client/components/enemy";

interface FighterTargetSlice {
	readonly fighters: {
		[uid: string]: Enemy | undefined;
	};
}

const initialState: FighterTargetSlice = {
	fighters: {},
};

export const fighterTargetSlice = createProducer(initialState, {
	setFighterTarget: (state, fighterUid: string, target: Enemy) => ({
		fighters: {
			...state.fighters,
			[fighterUid]: target,
		},
	}),
	removeFighterTarget: (state, fighterUid: string) => ({
		fighters: {
			...state.fighters,
			[fighterUid]: undefined,
		},
	}),
});

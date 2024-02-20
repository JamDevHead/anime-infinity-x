import { createProducer } from "@rbxts/reflex";
import { assign } from "@/shared/utils/object-utils";

interface FighterSpecialsState {
	readonly [fighterId: string]: number;
}

const initialState: FighterSpecialsState = {};

export const fighterSpecialsSlice = createProducer(initialState, {
	increaseFighterSpecial: (state, fighterId: string, amount: number) => {
		return assign(state, { [fighterId]: math.min((state[fighterId] ?? 0) + amount, 100) });
	},

	decreaseFighterSpecial: (state, fighterId: string, amount: number) => {
		return assign(state, { [fighterId]: math.max((state[fighterId] ?? 0) - amount, 0) });
	},

	setFighterSpecial: (state, fighterId: string, amount: number) => {
		return assign(state, { [fighterId]: amount });
	},
});

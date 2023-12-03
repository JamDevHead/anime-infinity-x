import { createProducer } from "@rbxts/reflex";
import { EggIncubator } from "@/@types/models/egg";

type EggsState = {
	eggsIncubators: Array<EggIncubator>;
};

const initialState: EggsState = {
	eggsIncubators: [],
};

export const eggsSlice = createProducer(initialState, {
	addEggIncubator: (state, eggIncubator: EggIncubator) => {
		return {
			...state,
			eggsIncubators: [...state.eggsIncubators, eggIncubator],
		};
	},
	removeEggIncubator: (state, eggIncubator: EggIncubator) => {
		return {
			...state,
			eggsIncubators: state.eggsIncubators.filter((e) => e.id !== eggIncubator.id),
		};
	},
});

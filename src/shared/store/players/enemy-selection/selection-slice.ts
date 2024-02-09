import { createProducer } from "@rbxts/reflex";
import { assign, mapProperty } from "@/shared/utils/object-utils";

interface SelectionState {
	[playerId: string]: string | undefined;
}

const initialState: SelectionState = {};

export const enemySelectionSlice = createProducer(initialState, {
	selectEnemy: (state, playerId: string, enemyId: string) => {
		return assign(state, { [playerId]: enemyId });
	},

	unselectEnemy: (state, playerId: string) => {
		return mapProperty(state, playerId, () => undefined);
	},
});

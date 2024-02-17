import { createProducer } from "@rbxts/reflex";
import { assign, mapProperty } from "@/shared/utils/object-utils";

interface DpsState {
	readonly [playerId: string]: number | undefined;
}

const initialState: DpsState = {};

export const dpsSlice = createProducer(initialState, {
	setPlayerDps: (state, playerId: string, dps: number) => assign(state, { [playerId]: dps }),

	removePlayerDps: (state, playerId: string) => mapProperty(state, playerId, () => undefined),
});

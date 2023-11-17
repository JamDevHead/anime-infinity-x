import { CombineStates } from "@rbxts/reflex";
import { dpsSlice } from "@/client/reflex/slices/dps";
import { hudSlice } from "@/client/reflex/slices/hud";
import { settingsSlice } from "@/client/reflex/slices/settings";
import { windowSlice } from "@/client/reflex/slices/window";

export type ClientState = CombineStates<typeof clientSlices>;

export const clientSlices = {
	dps: dpsSlice,
	hud: hudSlice,
	settings: settingsSlice,
	window: windowSlice,
};

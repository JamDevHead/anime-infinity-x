import { RootState } from "@/client/store";

export const selectHudVisible = (state: RootState) => {
	return state.hud.visible;
};

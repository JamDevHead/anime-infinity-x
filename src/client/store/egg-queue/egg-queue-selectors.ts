import { RootState } from "@/client/store";

export const selectEggQueue = (state: RootState) => {
	return state.eggQueue.queue;
};

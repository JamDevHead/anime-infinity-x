import { RootState } from "@/client/store";

export const selectLoading = (state: RootState) => {
	return state.loading;
};

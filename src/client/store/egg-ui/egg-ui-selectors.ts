import { RootState } from "@/client/store";

export const selectEggUiStatus = (state: RootState) => state.eggUi.opened;

import { createSelector } from "@rbxts/reflex";
import { SharedState } from "@/shared/store";

export const selectStoreFeatured = (state: SharedState) => state.store.featured;

const selectStoreContents = (state: SharedState) => state.store.contents;

export const selectStoreContent = (id: string) => {
	return createSelector(selectStoreContents, (contents) => {
		return contents.find((contentInfo) => contentInfo.type === "Fighters" && contentInfo.content.id === id);
	});
};

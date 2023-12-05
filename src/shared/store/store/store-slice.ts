import { createProducer } from "@rbxts/reflex";
import { ContentInfo, StoreCard } from "@/shared/store/store/store-types";

interface StoreSlice {
	featured: StoreCard[];
	contents: ContentInfo[];
}

const initialState: StoreSlice = {
	featured: [
		{
			id: "1",
			title: "Gaming card",
			contents: ["1", "2"],
		},
	],
	contents: [
		{
			type: "Fighters",
			content: {
				id: "1",
				name: "Naro",
				zone: "NRT",
			},
		},
	],
};

export const storeSlice = createProducer(initialState, {
	addFeatured: (state, card: StoreCard) => ({
		...state,
		featured: [...state.featured, card],
	}),

	removeFeatured: (state, cardId: StoreCard["id"]) => ({
		...state,
		featured: state.featured.filter((card) => card.id !== cardId),
	}),
});

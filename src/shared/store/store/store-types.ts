export interface StoreCard {
	id: string;
	title: string;
	contents: string[];
}

export interface ContentFighters {
	id: string;
	name: string;
	zone: string;
	price?: number;
}

export interface ContentInfo<T = "Fighters"> {
	type: T;
	content: T extends "Fighters" ? ContentFighters : never;
}

import Object from "@rbxts/object-utils";
import { images } from "@/shared/assets/images";

export const ZONES = {
	nrt: {
		name: "Naruto",
		price: 0,
		background: images.ui.teleport.nrt,
	},
	one: {
		name: "One Piece",
		price: 1000,
		background: images.ui.teleport.one,
	},
	dbz: {
		name: "Dragon Ball Z",
		price: 30000,
		background: images.ui.teleport.dbz,
	},
	aot: {
		name: "Attack on Titan",
		price: 100000,
		background: images.ui.teleport.aot,
	},
	tkr: {
		name: "Tokyo Revengers",
		price: 500000,
		background: images.ui.teleport.tkr,
	},
	dms: {
		name: "Demon Slayer",
		price: 1000000,
		background: images.ui.teleport.dms,
	},
};

export const ZONES_KEYS = Object.keys(ZONES) as (keyof typeof ZONES)[];

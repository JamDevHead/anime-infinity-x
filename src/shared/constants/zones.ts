import Object from "@rbxts/object-utils";
import { images } from "@/shared/assets/images";

export const ZONES = {
	nrt: {
		name: "Naruto",
		background: images.ui.teleport.nrt,
	},
	aot: {
		name: "Attack on Titan",
		background: images.ui.teleport.aot,
	},
	dbz: {
		name: "Dragon Ball Z",
		background: images.ui.teleport.dbz,
	},
	dms: {
		name: "Demon Slayer",
		background: images.ui.teleport.dms,
	},
	one: {
		name: "One Piece",
		background: images.ui.teleport.one,
	},
};

export const ZONES_KEYS = Object.keys(ZONES) as (keyof typeof ZONES)[];

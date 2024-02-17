import { $git } from "rbxts-transform-debug";
import { DefaultSettings } from "@/shared/constants/default-settings";
import { PlayerData } from "@/shared/store/players/players-types";

export const defaultPlayerData = {
	balance: {
		coins: 0,
		stars: 0,
	},
	inventory: {
		maxFighters: 3,
		maxStorage: 100,
	},
	missions: {
		all: [],
		active: undefined,
	},
	fighters: {
		actives: [],
		all: {},
	},
	boosts: {
		all: [],
	},
	settings: DefaultSettings,
	zones: {
		current: "NRT",
		changing: false,
		unlocked: ["NRT"],
	},
	index: {
		discovered: [],
	},
	info: {
		firstTime: true,
		version: $git("Commit").Commit,
	},
} satisfies PlayerData;

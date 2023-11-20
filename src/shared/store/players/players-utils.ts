import { PlayerData } from "@/shared/store/players/players-types";

export const defaultPlayerData = {
	balance: {
		coins: 0,
		stars: 0,
	},
	inventory: {},
	missions: {
		all: [],
		active: undefined,
	},
	fighters: {
		actives: [],
		all: [],
	},
	boosts: {
		all: [],
	},
	settings: {},
	zones: {
		current: "NRT",
		unlocked: [],
	},
} satisfies PlayerData;

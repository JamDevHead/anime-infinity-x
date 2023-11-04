export interface PlayerData {
	balance: PlayerBalance;
	inventory: {};
	missions: {};
	fighters: {};
	boosts: {};
	settings: {};
	zones: PlayerZones;
}

export interface PlayerBalance {
	coins: number;
	stars: number;
}

export interface PlayerZones {
	current: string | undefined;
	unlocked: string[];
}

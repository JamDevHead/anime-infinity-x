export interface PlayerData {
	balance: PlayerBalance;
	inventory: {};
	missions: {};
	fighters: {};
	boosts: {};
	settings: {};
}

export interface PlayerBalance {
	coins: number;
	stars: number;
}

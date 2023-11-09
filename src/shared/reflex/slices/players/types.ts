export interface PlayerData {
	balance: PlayerBalance;
	inventory: NonNullable<unknown>;
	missions: NonNullable<unknown>;
	fighters: NonNullable<unknown>;
	boosts: NonNullable<unknown>;
	settings: NonNullable<unknown>;
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

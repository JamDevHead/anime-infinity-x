import { Mission } from "@/@types/models/mission";

export interface PlayerData {
	balance: PlayerBalance;
	inventory: NonNullable<unknown>;
	missions: PlayerMission;
	fighters: PlayerFighters;
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

export interface PlayerFighters {
	actives: PlayerFighter[];
	all: PlayerFighter[];
}

export interface PlayerFighter {
	name: string;
	level: number;
}

export interface PlayerMission {
	all: Array<Mission>;
	active: Mission | undefined;
}

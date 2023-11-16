import { Boost } from "@/@types/models/boost";
import { Mission } from "@/@types/models/mission";

export interface PlayerData {
	balance: PlayerBalance;
	inventory: NonNullable<unknown>;
	missions: PlayerMission;
	fighters: PlayerFighters;
	boosts: PlayerBoosts;
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
	actives: string[];
	all: PlayerFighter[];
}

export interface PlayerFighter {
	zone: string;
	uid: string;
	name: string;
	level: number;
}

export interface PlayerMission {
	all: Array<Mission>;
	active: Mission | undefined;
}

export interface PlayerBoosts {
	all: Array<Boost>;
}

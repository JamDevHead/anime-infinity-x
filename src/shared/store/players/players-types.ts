import { Boost } from "@/@types/models/boost";
import { Mission } from "@/@types/models/mission";

export interface PlayerData {
	balance: PlayerBalance;
	inventory: PlayerInventory;
	missions: PlayerMission;
	fighters: PlayerFighters;
	boosts: PlayerBoosts;
	settings: Record<string, boolean | number>;
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

export interface PlayerInventory {
	all: Array<PlayerFighter>;
	maxStorage: number;
	maxFighters: number;
}

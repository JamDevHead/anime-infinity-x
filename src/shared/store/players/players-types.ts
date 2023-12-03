import { Boost } from "@/@types/models/boost";
import { Mission } from "@/shared/store/players/missions";

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
	changing: boolean;
	unlocked: string[];
}

export interface PlayerFighters {
	actives: string[];
	all: PlayerFighter[];
}

export interface PlayerFighter {
	zone: string;
	uid: string;
	characterUid: string;
	name: string;
	displayName: string;
	stats: {
		damage: number;
		dexterity: number;
		level: number;
		xp: number;
		sellPrice: number;
	};
	rarity: number;
}

export interface PlayerMission {
	all: Mission[];
	active: string | undefined;
}

export interface PlayerBoosts {
	all: Array<Boost>;
}

export interface PlayerInventory {
	maxStorage: number;
	maxFighters: number;
}

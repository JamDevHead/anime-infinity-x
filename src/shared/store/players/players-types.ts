import { Boost } from "@/@types/models/boost";
import { Setting } from "@/@types/models/setting";
import { Mission } from "@/shared/store/players/missions";

export interface PlayerData {
	balance: PlayerBalance;
	inventory: PlayerInventory;
	missions: PlayerMission;
	fighters: PlayerFighters;
	boosts: PlayerBoosts;
	settings: Record<string, Setting>;
	zones: PlayerZones;
	index: PlayerIndex;
	info: PlayerInfo;
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
	actives: { fighterId: string; characterId: string }[];
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
		sellPrice?: number;
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

export interface PlayerIndex {
	discovered: string[];
}

export interface PlayerInfo {
	firstTime: boolean;
	version: string;
}

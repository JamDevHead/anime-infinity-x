import { PlayerFighter } from "@/shared/store/players";

export const INITIAL_FIGHTERS: Omit<PlayerFighter, "uid" | "characterUid">[] = [
	{
		displayName: "Naro",
		name: "Naro",
		zone: "NRT",
		stats: {
			level: 1,
			damage: 5,
			dexterity: 5,
			xp: 0,
		},
		rarity: 1,
	},
	{
		displayName: "Rock",
		name: "Rock",
		zone: "NRT",
		stats: {
			level: 1,
			damage: 5,
			dexterity: 5,
			xp: 0,
		},
		rarity: 1,
	},
	{
		displayName: "Bro",
		name: "Bro",
		zone: "NRT",
		stats: {
			level: 1,
			damage: 5,
			dexterity: 5,
			xp: 0,
		},
		rarity: 1,
	},
];

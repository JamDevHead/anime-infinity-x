/**
 * Represents the rarity levels for a fighter.
 * Probabilistic values are used to determine the rarity of a fighter.
 * @enum {number}
 */
export enum Rarity {
	RARITY_1 = 80,
	RARITY_2 = 40,
	RARITY_3 = 20,
	RARITY_4 = 10,
	RARITY_5 = 5,
	RARITY_6 = 1,
	RARITY_7 = 0.001,
}

export const FighterRarity = {
	nrt: {
		Naro: Rarity.RARITY_1,
		Bro: Rarity.RARITY_2,
		Rock: Rarity.RARITY_3,
		Oro: Rarity.RARITY_4,
		PeanutMan: Rarity.RARITY_5,
		Jiro: Rarity.RARITY_6,
		GoldNinja: Rarity.RARITY_7,
	},
	one: {
		Luffo: Rarity.RARITY_1,
		Zura: Rarity.RARITY_2,
		FireFeet: Rarity.RARITY_3,
		Mi: Rarity.RARITY_4,
		WhiteBeard: Rarity.RARITY_5,
		BlackBeard: Rarity.RARITY_6,
		HeavenStrawHat: Rarity.RARITY_7,
	},
	dbz: {
		Kora: Rarity.RARITY_1,
		Geku: Rarity.RARITY_2,
		Master: Rarity.RARITY_3,
		BigEar: Rarity.RARITY_4,
		BigHorn: Rarity.RARITY_5,
		FullBlack: Rarity.RARITY_6,
		FullDrip: Rarity.RARITY_7,
	},
	aot: {
		BlondGuy: Rarity.RARITY_1,
		Ze: Rarity.RARITY_2,
		Levo: Rarity.RARITY_3,
		Eron: Rarity.RARITY_4,
		MyHouse: Rarity.RARITY_5,
		Colossal: Rarity.RARITY_6,
		HauntTitan: Rarity.RARITY_7,
	},
	tkr: {
		Mats: Rarity.RARITY_1,
		No: Rarity.RARITY_2,
		Sho: Rarity.RARITY_3,
		Tai: Rarity.RARITY_4,
		Tako: Rarity.RARITY_5,
		Tetto: Rarity.RARITY_6,
		Droke: Rarity.RARITY_7,
	},
	dms: {
		Nezuko: Rarity.RARITY_1,
		Muzo: Rarity.RARITY_2,
		Gyo: Rarity.RARITY_3,
		Tanjo: Rarity.RARITY_4,
		Renga: Rarity.RARITY_5,
		Toma: Rarity.RARITY_6,
		Hont: Rarity.RARITY_7,
	},
};

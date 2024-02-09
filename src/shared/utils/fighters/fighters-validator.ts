import { t } from "@rbxts/t";
import { ActivePlayerFighter, PlayerFighter } from "@/shared/store/players";

export const validateFighter = t.interface<{ [index in keyof PlayerFighter]: t.check<PlayerFighter[index]> }>({
	uid: t.string,
	displayName: t.string,
	name: t.string,
	zone: t.string,
	characterUid: t.string,
	rarity: t.number,
	stats: t.interface({
		damage: t.number,
		dexterity: t.number,
		level: t.number,
		xp: t.number,
		sellPrice: t.optional(t.number),
	}),
});

export const validateActiveFighter = t.interface<{
	[index in keyof ActivePlayerFighter]: t.check<ActivePlayerFighter[index]>;
}>({
	fighterId: t.string,
	characterId: t.string,
});

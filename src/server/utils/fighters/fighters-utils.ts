import { md5 } from "@rbxts/rbxts-hashlib";
import { HttpService, ReplicatedStorage } from "@rbxts/services";
import { FighterStats } from "@/server/constants/fighter-stats";
import { store } from "@/server/store";
import { PlayerFighter, selectPlayerIndex } from "@/shared/store/players";
import { selectActivePlayerFighters, selectPlayerFighter } from "@/shared/store/players/fighters";

const fightersFolder = ReplicatedStorage.assets.Avatars.FightersModels;

export function doesPlayerHasFighter(player: Player, fighterUid: string) {
	const userId = tostring(player.UserId);
	return store.getState(selectPlayerFighter(userId, fighterUid)) !== undefined;
}

export const isFighterEquipped = (player: Player, fighterUid: string) => {
	const userId = tostring(player.UserId);
	const activeFighters = store.getState(selectActivePlayerFighters(userId));
	if (!activeFighters) return false;

	return activeFighters.includes(fighterUid);
};

export function addFighterFor(player: Player, fighterData: Omit<PlayerFighter, "uid" | "characterUid">) {
	const fighterZone = fightersFolder.FindFirstChild(fighterData.zone);
	const fighterModel = fighterZone?.FindFirstChild(fighterData.name);

	assert(fighterModel, `Failed to find ${fighterData.name}`);

	const userId = tostring(player.UserId);
	const characterUid = md5(fighterData.name);
	const fighterUid = HttpService.GenerateGUID(false);

	const index = store.getState(selectPlayerIndex(userId));
	if (index === undefined) return;

	if (!index.discovered.includes(characterUid)) store.addDiscoveredFighter(userId, characterUid);

	store.addFighter(userId, fighterUid, { ...fighterData, characterUid });
	return {
		...fighterData,
		uid: fighterUid,
		characterUid,
	} as PlayerFighter;
}

export function removeFighterFor(player: Player, fighterUid: string) {
	const userId = tostring(player.UserId);

	if (isFighterEquipped(player, fighterUid)) {
		store.removeActiveFighter(userId, fighterUid);
	}

	store.removeFighter(userId, fighterUid);
}

export const generateStats = (rarity: number, zoneIndex: number) => {
	const damage = math.random() * rarity * zoneIndex * FighterStats.damageMultiplier;
	const dexterity = math.random() * rarity * zoneIndex * FighterStats.dexterityMultiplier;
	const sellPrice = math.random() * rarity * zoneIndex * FighterStats.sellPriceMultiplier;
	const level = math.random(1, 3);
	const xp = 0;

	return { damage, dexterity, sellPrice, level, xp };
};

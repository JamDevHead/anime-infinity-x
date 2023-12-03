import { md5 } from "@rbxts/rbxts-hashlib";
import { HttpService, ReplicatedStorage } from "@rbxts/services";
import { store } from "@/server/store";
import { PlayerFighter } from "@/shared/store/players";
import { selectPlayerFighter } from "@/shared/store/players/fighters";

const fightersFolder = ReplicatedStorage.assets.Avatars.FightersModels;

export function doesPlayerHasFighter(player: Player, fighterUid: string) {
	const userId = tostring(player.UserId);
	return store.getState(selectPlayerFighter(userId, fighterUid)) !== undefined;
}

export function addFighterFor(player: Player, fighterData: Omit<PlayerFighter, "uid" | "characterUid">) {
	const fighterZone = fightersFolder.FindFirstChild(fighterData.zone);
	const fighterModel = fighterZone?.FindFirstChild(fighterData.name);

	assert(fighterModel, `Failed to find ${fighterData.name}`);

	const userId = tostring(player.UserId);
	const characterUid = md5(fighterData.name);
	const fighterUid = HttpService.GenerateGUID(false);

	store.addFighter(userId, fighterUid, { ...fighterData, characterUid });
}

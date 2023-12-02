import { Logger } from "@rbxts/log";
import { Profile } from "@rbxts/profileservice/globals";
import { HttpService, ReplicatedStorage } from "@rbxts/services";
import { PlayerData } from "@/shared/store/players";

const fightersFolder = ReplicatedStorage.assets.Avatars.FightersModels;

export function loadFighters(player: Player, profile: Profile<PlayerData>, logger: Logger) {
	const fighters = profile.Data.fighters;
	const fightersToRemove = [] as string[];

	print(`Loading ${player.Name} data ${HttpService.JSONEncode(profile.Data)})`);
	logger.Debug("Loading {player} data {@data}", player.Name, profile.Data);

	for (const fighter of fighters.all) {
		const fighterZone = fighter !== undefined ? fightersFolder.FindFirstChild(fighter.zone) : undefined;
		const fighterModel = fighter !== undefined ? fighterZone?.FindFirstChild(fighter.name) : undefined;

		if (fighterModel) {
			continue;
		}

		fightersToRemove.push(fighter.uid);
	}

	if (fightersToRemove.size() === 0) {
		logger.Debug(`Player ${player.Name} has no outdated fighters in it's data`);
		return;
	}

	logger.Debug(`Removing ${fightersToRemove.size()} outdated fighters from ${player.Name} ${player.UserId}`);

	fightersToRemove.forEach((fighterUid) => {
		profile.Data.fighters.all = fighters.all.filter((fighter) => fighter.uid !== fighterUid);
		profile.Data.fighters.actives = fighters.actives.filter((fighter) => fighter !== fighterUid);
	});
}

import { Logger } from "@rbxts/log";
import { Profile } from "@rbxts/profileservice/globals";
import { ReplicatedStorage } from "@rbxts/services";
import { PlayerData } from "@/shared/store/players";

const fightersFolder = ReplicatedStorage.assets.Avatars.FightersModels;

export function loadFighters(player: Player, profile: Profile<PlayerData>, logger: Logger) {
	const fighters = profile.Data.fighters;
	const fightersToRemove = [] as string[];

	logger.Info("Loading {player} data {@data}", player.Name, profile.Data);

	for (const fighter of fighters.all) {
		const fighterZone = fighter?.zone === undefined ? fightersFolder.FindFirstChild(fighter.zone) : undefined;
		const fighterModel = fighter?.name === undefined ? fighterZone?.FindFirstChild(fighter.name) : undefined;

		if (fighterModel) {
			continue;
		}

		fightersToRemove.push(fighter.uid);
	}

	if (fightersToRemove.size() === 0) {
		logger.Info(`Player ${player.Name} has no outdated fighters in it's data`);
		return;
	}

	logger.Info(`Removing ${fightersToRemove.size()} outdated fighters from ${player.Name} ${player.UserId}`);

	fightersToRemove.forEach((fighterUid) => {
		profile.Data.fighters.all = fighters.all.filter((fighter) => fighter.uid !== fighterUid);
		profile.Data.fighters.actives = fighters.actives.filter((fighter) => fighter !== fighterUid);
	});
}

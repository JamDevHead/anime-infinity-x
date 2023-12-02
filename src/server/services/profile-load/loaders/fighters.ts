import { Logger } from "@rbxts/log";
import { Profile } from "@rbxts/profileservice/globals";
import { ReplicatedStorage } from "@rbxts/services";
import { PlayerData, PlayerFighter } from "@/shared/store/players";

const fightersFolder = ReplicatedStorage.assets.Avatars.FightersModels;

export function loadFighters(player: Player, profile: Profile<PlayerData>, logger: Logger) {
	const fighters = profile.Data.fighters;
	const fightersToRemove = [] as PlayerFighter[];

	logger.Info("Loading {player} data {@data}", player.Name, profile.Data);

	for (const fighter of fighters.all) {
		const fighterZone = fighter?.zone !== undefined ? fightersFolder.FindFirstChild(fighter.zone) : undefined;
		const fighterModel = fighter?.name !== undefined ? fighterZone?.FindFirstChild(fighter.name) : undefined;

		if (fighterModel) {
			continue;
		}

		fightersToRemove.push(fighter);
	}

	if (fightersToRemove.size() === 0) {
		logger.Info(`Player ${player.Name} has no outdated fighters in it's data`);
		return;
	}

	logger.Info(`Removing ${fightersToRemove.size()} outdated fighters from ${player.Name} ${player.UserId}`);

	fightersToRemove.forEach((fighterToRemove) => {
		profile.Data.fighters.all = fighters.all.filter((fighter) => {
			if (fighterToRemove.uid !== undefined) {
				return fighterToRemove.uid !== fighter.uid;
			}

			return fighterToRemove.name !== fighter.name;
		});
		profile.Data.fighters.actives = fighters.actives.filter((fighter) => fighter !== fighterToRemove.uid);
	});
}

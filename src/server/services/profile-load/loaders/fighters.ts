import { Logger } from "@rbxts/log";
import { Profile } from "@rbxts/profileservice/globals";
import { ReplicatedStorage } from "@rbxts/services";
import { t } from "@rbxts/t";
import { ActivePlayerFighter, PlayerData, PlayerFighter } from "@/shared/store/players";
import { validateActiveFighter, validateFighter } from "@/shared/utils/fighters";

const fightersFolder = ReplicatedStorage.assets.Avatars.FightersModels;

function checkAllFighters(fighters: PlayerFighter[], idsToRemove: Set<string>, fightersRemoved: number) {
	for (const [index, fighter] of pairs(fighters)) {
		let valid = validateFighter(fighter);

		// Check if fighter exists in the game
		const fighterZone = valid ? fightersFolder.FindFirstChild(fighter.zone) : undefined;
		const fighterModel = fighterZone?.FindFirstChild(fighter.name);

		if (!fighterModel) {
			valid = false;
		}

		// If fighter is already prone to removal
		if (valid && idsToRemove.has(fighter.uid)) {
			valid = false;
		}

		if (!valid) {
			fighters.unorderedRemove(index - 1);
			fightersRemoved++;

			// Remove the fighter using the ID
			if (t.string(fighter)) {
				idsToRemove.add(fighter);
			} else {
				const hasId = t.interface({
					uid: t.string,
				});

				if (hasId(fighter)) {
					idsToRemove.add(fighter.uid);
				}
			}
		}
	}

	return fightersRemoved;
}

function checkActiveFighters(
	fighters: ActivePlayerFighter[],
	allFighters: PlayerFighter[],
	idsToRemove: Set<string>,
	fightersRemoved: number,
) {
	for (const [index, fighter] of pairs(fighters)) {
		let valid = validateActiveFighter(fighter);

		// If fighter is already prone to removal
		if (valid && idsToRemove.has(fighter.fighterId)) {
			valid = false;
		}

		// Check if active fighter still exists
		if (valid && allFighters.some((otherFighter) => otherFighter.uid === fighter.fighterId)) {
			valid = false;
		}

		if (!valid) {
			fighters.unorderedRemove(index - 1);
			fightersRemoved++;

			// Remove the fighter using the ID
			if (t.string(fighter)) {
				idsToRemove.add(fighter);
			} else {
				const hasId = t.interface({
					fighterId: t.string,
				});

				if (hasId(fighter)) {
					idsToRemove.add(fighter.fighterId);
				}
			}
		}
	}

	return fightersRemoved;
}

export function loadFighters(player: Player, profile: Profile<PlayerData>, logger: Logger) {
	const fighters = profile.Data.fighters;
	const idsToRemove = new Set<string>();

	const allFighters = table.clone(fighters.all);
	const activeFighters = table.clone(fighters.actives);
	let fightersRemoved = 0;

	fightersRemoved = checkAllFighters(allFighters, idsToRemove, fightersRemoved);
	fightersRemoved = checkActiveFighters(activeFighters, allFighters, idsToRemove, fightersRemoved);

	if (fightersRemoved === 0) {
		logger.Info(`Player ${player.Name} has no outdated fighters in it's data`);
		return;
	}

	logger.Info(`Removed ${fightersRemoved} outdated fighters from ${player.Name} ${player.UserId}`);

	profile.Data.fighters.all = allFighters;
	profile.Data.fighters.actives = activeFighters;
}

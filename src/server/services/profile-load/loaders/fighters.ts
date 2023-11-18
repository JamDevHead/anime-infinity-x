import { Profile } from "@rbxts/profileservice/globals";
import { HttpService, ReplicatedStorage } from "@rbxts/services";
import { producer } from "@/server/reflex/producers";
import { selectPlayerFighters } from "@/shared/reflex/selectors";
import { PlayerData } from "@/shared/reflex/slices/players/types";

const initialFighter = ReplicatedStorage.assets.Avatars.FightersModels.NRT;

export default function loadFighters(profile: Profile<PlayerData>) {
	const fighters = profile.Data.fighters;
	const userId = tostring(profile.UserIds.shift());

	if (fighters.all.size() === 0) {
		function create() {
			const uid = HttpService.GenerateGUID(false);

			producer.addFighter(userId, uid, {
				name: initialFighter.Oro.Name,
				level: 0,
				zone: initialFighter.Name,
			});

			producer.addActiveFighter(userId, uid);
		}

		task.spawn(() => {
			for (const _i of $range(1, 30)) {
				const playerFighters = producer.getState(selectPlayerFighters(userId));
				task.wait(1.5);
				create();
				task.wait(1.5);
				if (playerFighters && playerFighters.all.size() > 5) {
					playerFighters.all.forEach((fighter, index) => {
						if (index > 5) {
							return;
						}

						producer.removeFighter(userId, fighter.uid);
					});
				}
			}
		});
	}
}

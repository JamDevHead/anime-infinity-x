import { Profile } from "@rbxts/profileservice/globals";
import { HttpService, ReplicatedStorage } from "@rbxts/services";
import { store } from "@/server/store";
import { PlayerData } from "@/shared/store/players/players-types";

const initialFighter = ReplicatedStorage.assets.Avatars.FightersModels.NRT;

export default function loadFighters(profile: Profile<PlayerData>) {
	const fighters = profile.Data.fighters;
	const userId = tostring(profile.UserIds.shift());

	if (fighters.all.size() === 0) {
		for (const index of $range(1, 2)) {
			const uid = HttpService.GenerateGUID(false);

			store.addFighter(userId, uid, {
				name: initialFighter.Oro.Name,
				level: 0,
				zone: initialFighter.Name,
				stats: {
					damage: 1,
					dexterity: 10 + index * 1.1,
				},
			});

			store.addActiveFighter(userId, uid);
		}
	}
}

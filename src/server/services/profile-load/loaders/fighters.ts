import { Profile } from "@rbxts/profileservice/globals";
import { HttpService, ReplicatedStorage } from "@rbxts/services";
import { store } from "@/server/store";
import { PlayerData } from "@/shared/store/players/players-types";

const initialFighter = ReplicatedStorage.assets.Avatars.FightersModels.NRT;

export default function loadFighters(profile: Profile<PlayerData>) {
	const fighters = profile.Data.fighters;
	const userId = tostring(profile.UserIds.shift());

	if (fighters.all.size() === 0) {
		const uid = HttpService.GenerateGUID(false);

		store.addFighter(userId, uid, {
			name: initialFighter.Oro.Name,
			displayName: initialFighter.Oro.Name,
			stats: {
				damage: 10,
				dexterity: 10,
				level: 1,
				xp: 0,
				sellPrice: 0,
			},
			rarity: 1,
			zone: initialFighter.Name,
		});

		store.addActiveFighter(userId, uid);
	}
}

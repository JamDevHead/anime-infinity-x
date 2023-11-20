import { Profile } from "@rbxts/profileservice/globals";
import { HttpService, ReplicatedStorage } from "@rbxts/services";
import { producer } from "@/server/reflex/producers";
import { PlayerData } from "@/shared/reflex/slices/players/types";

const initialFighter = ReplicatedStorage.assets.Avatars.FightersModels.NRT;

export default function loadFighters(profile: Profile<PlayerData>) {
	const fighters = profile.Data.fighters;
	const userId = tostring(profile.UserIds.shift());

	if (fighters.all.size() === 0) {
		const uid = HttpService.GenerateGUID(false);

		producer.addFighter(userId, uid, {
			name: initialFighter.Oro.Name,
			level: 0,
			zone: initialFighter.Name,
		});

		producer.addActiveFighter(userId, uid);
	}
}

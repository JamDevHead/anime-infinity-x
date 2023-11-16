import { Profile } from "@rbxts/profileservice/globals";
import { HttpService, ServerStorage } from "@rbxts/services";
import { PlayerData } from "@/shared/reflex/slices/players/types";

const initialFighter = ServerStorage.assets.Avatars.FightersModels.NRT.TestFighter;

export default function loadFighters(profile: Profile<PlayerData>) {
	const fighters = profile.Data.fighters;

	if (fighters.all.size() === 0) {
		const uid = HttpService.GenerateGUID(false);
		fighters.all.push({
			name: initialFighter.Name,
			level: 0,
			zone: initialFighter.Parent!.Name,
			uid,
		});
		fighters.actives.push(uid);
	}
}

import { Profile } from "@rbxts/profileservice/globals";
import { ServerStorage } from "@rbxts/services";
import { PlayerData } from "@/shared/reflex/slices/players/types";

const initialFighter = ServerStorage.assets.Avatars.FightersModels.NRT.TestFighter;

export default function loadFighters(profile: Profile<PlayerData>) {
	const fighters = profile.Data.fighters;

	if (fighters.all.size() === 0) {
		fighters.all.push({
			name: initialFighter.Name,
			level: 0,
		});
	}
}

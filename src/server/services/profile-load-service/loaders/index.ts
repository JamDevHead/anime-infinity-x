import { Logger } from "@rbxts/log";
import { Profile } from "@rbxts/profileservice/globals";
import { loadFighters } from "@/server/services/profile-load-service/loaders/fighters";
import { PlayerData } from "@/shared/store/players";

export function loadPlayerData(player: Player, profile: Profile<PlayerData>, logger: Logger) {
	loadFighters(player, profile, logger);
}

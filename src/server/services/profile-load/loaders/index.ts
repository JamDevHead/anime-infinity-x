import { Profile } from "@rbxts/profileservice/globals";
import loadFighters from "@/server/services/profile-load/loaders/fighters";
import { PlayerData } from "@/shared/reflex/slices/players/types";

export default function loadData(profile: Profile<PlayerData>) {
	loadFighters(profile);
}

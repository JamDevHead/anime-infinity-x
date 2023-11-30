import { store } from "@/server/store";
import { selectPlayerFighter } from "@/shared/store/players/fighters";

export function doesPlayerHasFighter(player: Player, fighterUid: string) {
	const userId = tostring(player.UserId);
	return store.getState(selectPlayerFighter(userId, fighterUid)) !== undefined;
}

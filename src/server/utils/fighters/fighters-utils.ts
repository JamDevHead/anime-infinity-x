import { store } from "@/server/store";
import { selectPlayerFighter } from "@/shared/store/players/fighters";

export function doesPlayerHasFighter(userId: string, fighterUid: string) {
	return store.getState(selectPlayerFighter(userId, fighterUid)) !== undefined;
}

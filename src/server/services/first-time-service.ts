import { OnStart, Service } from "@flamework/core";
import { store } from "@/server/store";
import { addFighterFor } from "@/server/utils/fighters";
import { INITIAL_FIGHTERS } from "@/shared/constants/initial-fighters";
import remotes from "@/shared/remotes";
import { selectPlayerInfo } from "@/shared/store/players";

@Service()
export class FirstTimeService implements OnStart {
	onStart() {
		remotes.firstTime.select.connect((player, fighterName) => {
			const playerInfo = store.getState(selectPlayerInfo(tostring(player.UserId)));

			if (!playerInfo || !playerInfo.firstTime) return;

			const fighter = INITIAL_FIGHTERS.find((fighter) => fighter.name === fighterName);

			if (!fighter) return;

			addFighterFor(player, fighter);
			store.setFirstTime(tostring(player.UserId), false);
		});
	}
}

import { OnStart, Service } from "@flamework/core";
import { store } from "@/server/store";
import { removeFighterFor } from "@/server/utils/fighters";
import remotes from "@/shared/remotes";
import { selectPlayerFighter, selectPlayerFighters } from "@/shared/store/players/fighters";

@Service()
export class FighterSellService implements OnStart {
	onStart(): void {
		remotes.inventory.sellFighter.connect((player, fighterUid) => {
			const userId = tostring(player.UserId);

			const fighters = store.getState(selectPlayerFighters(userId));
			if (!fighters) return;

			if (fighters.all.size() <= 1) return;

			const fighter = store.getState(selectPlayerFighter(userId, fighterUid));
			if (!fighter) return;

			removeFighterFor(player, fighterUid);
			store.addBalance(userId, "coins", fighter.stats.sellPrice ?? 0);
		});
	}
}

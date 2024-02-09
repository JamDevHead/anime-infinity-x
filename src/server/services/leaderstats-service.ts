import { OnStart, Service } from "@flamework/core";
import Abbreviator from "@rbxts/abbreviate";
import { OnPlayerAdd } from "@/server/services/lifecycles/on-player-add";
import { store } from "@/server/store";
import { selectPlayerBalance } from "@/shared/store/players";

@Service()
export class LeaderstatsService implements OnStart, OnPlayerAdd {
	private playerConnections = new Map<Player, () => void>();
	private leaderstatsAbbreviator = new Abbreviator();

	onStart() {
		this.leaderstatsAbbreviator.setSetting("stripTrailingZeroes", true);
		this.leaderstatsAbbreviator.setSetting("decimalPlaces", 0);
	}

	onPlayerAdded(player: Player) {
		const leaderstats = new Instance("Folder");
		const coins = new Instance("StringValue");

		coins.Name = "Coins";
		leaderstats.Name = "leaderstats";

		coins.Parent = leaderstats;
		leaderstats.Parent = player;

		const userId = tostring(player.UserId);

		const unsubscribe = store.subscribe(selectPlayerBalance(userId), (balance) => {
			if (!balance) {
				return;
			}

			coins.Value = this.leaderstatsAbbreviator.numberToString(balance.coins);
		});

		this.playerConnections.set(player, unsubscribe);
	}

	onPlayerRemoved(player: Player) {
		this.playerConnections.get(player)?.();
		this.playerConnections.delete(player);
	}
}

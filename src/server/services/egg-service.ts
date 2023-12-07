import { OnStart, Service } from "@flamework/core";
import { Logger } from "@rbxts/log";
import Object from "@rbxts/object-utils";
import { store } from "@/server/store";
import { addFighterFor, generateStats } from "@/server/utils/fighters";
import { FighterRarity, Rarity } from "@/shared/constants/rarity";
import remotes from "@/shared/remotes";
import { selectPlayerBalance } from "@/shared/store/players";

@Service()
export class EggService implements OnStart {
	constructor(private readonly logger: Logger) {}

	onStart(): void {
		this.logger.Info("EggService started");

		remotes.eggs.open.onRequest((player, zone) => {
			this.logger.Info(`Player ${player.Name} opened egg ${zone}`);

			const balance = store.getState(selectPlayerBalance(tostring(player.UserId)));

			if (balance === undefined) return;

			const rarityByZone = FighterRarity[(zone.lower() ?? "nrt") as keyof typeof FighterRarity];
			const zoneIndex = Object.keys(FighterRarity).findIndex((zoneName) => zoneName === zone.lower());

			if (zoneIndex === -1) return;

			if (!rarityByZone) return;

			const randomRarity = math.random(0.0001, 100);
			const rarity = Object.entries(rarityByZone).find(([, rarity]) => randomRarity <= (rarity as number)) as
				| [string, number]
				| undefined;
			if (!rarity) return;

			const price = 100 * zoneIndex;

			if (balance.coins < price) return;

			this.logger.Info("Player {@PlayerName} got {@Rarity} from egg {@Zone}", player.Name, rarity[0], zone);

			this.logger.Info("Removing {@Price} coins from {@PlayerName}", price, player.Name);
			store.removeBalance(tostring(player.UserId), "coins", price);

			return addFighterFor(player, {
				name: rarity[0],
				displayName: rarity[0],
				rarity: this.getRarityByEnum(rarity[1]) ?? 1,
				stats: generateStats(rarity[1]),
				zone,
			});
		});
	}

	getRarityByEnum(rarity: number) {
		return tonumber(Rarity[rarity].split("_")[1]);
	}
}

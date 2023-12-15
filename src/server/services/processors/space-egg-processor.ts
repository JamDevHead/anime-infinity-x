import { OnStart, Service } from "@flamework/core";
import { Logger } from "@rbxts/log";
import Object from "@rbxts/object-utils";
import { Players } from "@rbxts/services";
import { EggService } from "@/server/services/egg-service";
import { ProductsService } from "@/server/services/products-service";
import { store } from "@/server/store";
import { addFighterFor, generateStats } from "@/server/utils/fighters";
import { Products } from "@/shared/assets/products";
import { FighterRarity, Rarity } from "@/shared/constants/rarity";
import remotes from "@/shared/remotes";
import { selectStoreContents } from "@/shared/store/store/store-selectors";

@Service()
export class SpaceEggProcessor implements OnStart {
	constructor(
		private readonly logger: Logger,
		private readonly productsService: ProductsService,
		private readonly eggService: EggService,
	) {}

	onStart(): void {
		this.productsService.processors.add((receiptInfo) => {
			if (receiptInfo.ProductId !== Products.SECRET_EGG_ROBUX) return false;

			const player = Players.GetPlayerByUserId(receiptInfo.PlayerId);

			if (!player) {
				return false;
			}

			const storeContents = store.getState(selectStoreContents);
			const fighters = storeContents.filter((contentInfo) => contentInfo.type === "Fighters");
			const randomFighter = fighters[math.random(fighters.size())].content;
			const zoneFightersRarity = FighterRarity[randomFighter.zone.lower() as keyof typeof FighterRarity];
			const fighterRarityEnum = zoneFightersRarity[
				randomFighter.name as keyof typeof zoneFightersRarity
			] as Rarity;
			const fighterRarity = this.eggService.getRarityByEnum(fighterRarityEnum);
			const zoneIndex = Object.keys(FighterRarity).findIndex(
				(zoneName) => zoneName === randomFighter.zone.lower(),
			);

			if (zoneIndex === -1) {
				return false;
			}

			if (fighterRarity === undefined) {
				return false;
			}

			this.logger.Info("Player purchased secret egg: {@player}", receiptInfo.PlayerId);

			const fighter = addFighterFor(player, {
				name: randomFighter.name,
				displayName: randomFighter.name,
				rarity: fighterRarity,
				zone: randomFighter.zone,
				stats: generateStats(fighterRarity, 0),
			});

			if (!fighter) {
				return false;
			}

			remotes.eggs.requestToOpen.fire(player, fighter);

			return true;
		});
	}
}

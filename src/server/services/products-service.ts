import { OnStart, Service } from "@flamework/core";
import { Logger } from "@rbxts/log";
import { MarketplaceService } from "@rbxts/services";
import { OnPlayerAdd } from "@/server/services/lifecycles/on-player-add";

@Service()
export class ProductsService implements OnStart, OnPlayerAdd {
	public processors = new Set<(receiptInfo: ReceiptInfo) => boolean>();
	private cache = new Map<Player, Set<number>>();

	constructor(private readonly logger: Logger) {}

	onStart(): void {
		this.logger.Info("Products service started");

		MarketplaceService.PromptGamePassPurchaseFinished.Connect((player, gamePassId, wasPurchased) => {
			if (!wasPurchased) {
				return;
			}

			const playerCache = this.getCache(player);

			if (playerCache.has(gamePassId)) {
				this.logger.Warn(
					"Player already had gamepass in cache: {@gamepassId} ({@player})",
					gamePassId,
					player.Name,
				);
				return;
			}

			playerCache.add(gamePassId);
		});

		MarketplaceService.ProcessReceipt = (receiptInfo) => {
			this.logger.Warn(
				"Player purchased gamepass: {@gamepassId} ({@player})",
				receiptInfo.ProductId,
				receiptInfo.PlayerId,
			);

			for (const process of this.processors) {
				const [success, result] = pcall(() => process(receiptInfo));

				if (success && result) {
					return Enum.ProductPurchaseDecision.PurchaseGranted;
				}
			}

			return Enum.ProductPurchaseDecision.NotProcessedYet;
		};
	}

	private getCache(player: Player) {
		const playerCache = this.cache.get(player);

		if (playerCache) {
			return playerCache;
		}

		const cache = new Set<number>();

		this.cache.set(player, cache);
		return cache;
	}

	onPlayerAdded(player: Player) {
		this.getCache(player);
	}

	onPlayerRemoved(player: Player) {
		this.cache.delete(player);
	}
}

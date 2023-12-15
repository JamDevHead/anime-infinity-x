import { OnStart, Service } from "@flamework/core";
import { Logger } from "@rbxts/log";
import { ProductsService } from "@/server/services/products-service";
import { Products } from "@/shared/assets/products";

@Service()
export class SpaceEggProcessor implements OnStart {
	constructor(
		private readonly logger: Logger,
		private readonly productsService: ProductsService,
	) {}

	onStart(): void {
		this.productsService.processors.add((receiptInfo) => {
			if (receiptInfo.ProductId !== Products.SECRET_EGG_ROBUX) return false;

			this.logger.Info("Player purchased secret egg: {@player}", receiptInfo.PlayerId);

			return true;
		});
	}
}

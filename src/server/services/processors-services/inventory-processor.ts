import { OnStart, Service } from "@flamework/core";
import { Logger } from "@rbxts/log";
import { ProductsService } from "@/server/services/products-service";
import { store } from "@/server/store";
import { GamePasses } from "@/shared/assets/game-passes";

@Service()
export class InventoryProcessor implements OnStart {
	constructor(
		private readonly logger: Logger,
		private readonly productsService: ProductsService,
	) {}

	onStart() {
		this.productsService.processors.add((receiptInfo) => {
			if (receiptInfo.ProductId !== GamePasses.PET_EQUIP_2 && receiptInfo.ProductId !== GamePasses.PET_EQUIP_5)
				return false;

			const quantity = receiptInfo.ProductId === GamePasses.PET_EQUIP_2 ? 2 : 5;
			store.addFighterSlot(tostring(receiptInfo.PlayerId), quantity);

			return true;
		});
	}
}

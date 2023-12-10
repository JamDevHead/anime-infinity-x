import { Controller, OnStart } from "@flamework/core";
import { Error } from "@/shared/utils/error-exception";

@Controller()
export class ProductsController implements OnStart {
	onStart(): void {
		throw new Error("Method not implemented.");
	}
}

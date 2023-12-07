import { Controller, OnStart } from "@flamework/core";
import { initializeClient } from "@rbxts/gameanalytics";
import { store } from "@/client/store";
import { selectLoading } from "@/client/store/loading/loading-selectors";

@Controller()
export class GameAnalyticsController implements OnStart {
	private initalized = false;

	onStart() {
		store.subscribe(selectLoading, (loading) => {
			if (loading.progress !== loading.maxProgress || this.initalized) {
				return;
			}

			this.initalized = true;
			initializeClient();
		});
	}
}

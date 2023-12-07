import { OnInit, Service } from "@flamework/core";
import { GameAnalytics } from "@rbxts/gameanalytics";
import { env } from "@/server/constants/env";

@Service()
export class GameAnalyticsService implements OnInit {
	onInit() {
		assert(env.GAME_ANALYTICS_GAME_KEY !== undefined, "GAME_ANALYTICS_GAME_KEY is undefined");
		assert(env.GAME_ANALYTICS_SECRET_KEY !== undefined, "GAME_ANALYTICS_SECRET_KEY is undefined");

		GameAnalytics.initialize({
			gameKey: env.GAME_ANALYTICS_GAME_KEY,
			secretKey: env.GAME_ANALYTICS_SECRET_KEY,
		});
	}
}

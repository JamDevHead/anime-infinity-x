import { OnTick, Service } from "@flamework/core";
import { store } from "@/server/store";

@Service()
export class DpsService implements OnTick {
	private dpsStore = new Map<string, number>();
	private timer = 0;

	onTick(dt: number) {
		this.timer += dt;

		if (this.timer < 1) {
			return;
		}

		const timer = this.timer;
		this.timer = -math.huge;

		this.dpsStore.forEach((dps, playerId) => {
			const calculatedTimer = dps / timer;
			store.setPlayerDps(playerId, math.floor(calculatedTimer));
			this.dpsStore.set(playerId, 0);
		});

		this.timer = 0;
	}

	public addToStore(player: Player, dps: number) {
		const userId = tostring(player.UserId);
		const oldDps = this.dpsStore.get(userId) ?? 0;
		this.dpsStore.set(userId, oldDps + dps);
	}
}

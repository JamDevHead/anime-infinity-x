import { OnTick, Service } from "@flamework/core";
import { OnPlayerAdd } from "@/server/services/lifecycles/on-player-add";
import { store } from "@/server/store";
import { selectPlayerDamagePerSecond } from "@/shared/store/dps";

@Service()
export class DpsService implements OnTick, OnPlayerAdd {
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
			const playerCalculatedDps = math.floor(calculatedTimer);
			const playerDps = store.getState(selectPlayerDamagePerSecond(playerId));

			if (playerDps === playerCalculatedDps) {
				return;
			}

			store.setPlayerDps(playerId, playerCalculatedDps);
			this.dpsStore.set(playerId, 0);
		});

		this.timer = 0;
	}

	onPlayerRemoved(player: Player) {
		store.removePlayerDps(tostring(player.UserId));
	}

	public addToStore(player: Player, dps: number) {
		const userId = tostring(player.UserId);
		const oldDps = this.dpsStore.get(userId) ?? 0;
		this.dpsStore.set(userId, oldDps + dps);
	}
}

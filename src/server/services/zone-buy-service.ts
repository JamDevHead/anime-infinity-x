import { OnStart, Service } from "@flamework/core";
import { store } from "@/server/store";
import { ZONES } from "@/shared/constants/zones";
import remotes from "@/shared/remotes";
import { selectPlayerBalance, selectPlayerZones } from "@/shared/store/players";

@Service()
export class ZoneBuyService implements OnStart {
	onStart(): void {
		remotes.zone.buy.connect((player, zone) => {
			const zones = store.getState(selectPlayerZones(tostring(player.UserId)));
			const balance = store.getState(selectPlayerBalance(tostring(player.UserId)));

			if (balance === undefined || zones === undefined) return;

			if (zones.unlocked.includes(zone)) return;

			const zoneData = ZONES[zone.lower() as keyof typeof ZONES];

			if (zoneData === undefined) return;

			if (balance.coins < zoneData.price) return;

			store.removeBalance(tostring(player.UserId), "coins", zoneData.price);
			store.unlockZone(tostring(player.UserId), zone.upper());
			store.setCurrentZone(tostring(player.UserId), zone.upper());
		});
	}
}

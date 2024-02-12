import { OnStart, Service } from "@flamework/core";
import { store } from "@/server/store";
import remotes from "@/shared/remotes";
import { selectPlayerZones } from "@/shared/store/players/zones";

@Service()
export class ZoneTeleportService implements OnStart {
	onStart() {
		remotes.zone.teleport.connect((player, zone) => {
			const zones = store.getState(selectPlayerZones(tostring(player.UserId)));

			if (!zones?.unlocked.includes(zone.upper())) return;

			store.setCurrentZone(tostring(player.UserId), zone.upper());
		});
	}
}

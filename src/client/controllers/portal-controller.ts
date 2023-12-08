import { Controller, OnStart, OnTick } from "@flamework/core";
import { Players, Workspace } from "@rbxts/services";
import { ZonesFolder } from "@/@types/models/zone";
import { store } from "@/client/store";
import { selectPlayerCurrentZone } from "@/shared/store/players/zones/zones-selectors";

@Controller()
export class PortalController implements OnStart, OnTick {
	private zonesFolder = Workspace.WaitForChild("Zones") as ZonesFolder;

	private openedMenu = false;
	private portals: Model[] = [];

	onStart(): void {
		const selectCurrentZone = selectPlayerCurrentZone(tostring(Players.LocalPlayer.UserId));

		this.onZoneChange(store.getState(selectCurrentZone));
		store.subscribe(selectPlayerCurrentZone(tostring(Players.LocalPlayer.UserId)), (currentZone) =>
			this.onZoneChange(currentZone),
		);
	}

	onTick(): void {
		if (this.portals.isEmpty()) return;

		this.portals.forEach((portal) => {
			const position = portal.GetPivot().Position;
			const distance = Players.LocalPlayer.DistanceFromCharacter(position);
			const isClose = distance !== 0 && distance <= 10;

			if (isClose && !this.openedMenu) {
				this.openedMenu = true;
				store.setPortalVisible(true);
			} else if (!isClose && this.openedMenu) {
				this.openedMenu = false;
				store.setPortalVisible(false);
			}
		});
	}

	private onZoneChange(currentZone: string | undefined) {
		if (currentZone === undefined) {
			return;
		}

		const zone = this.zonesFolder.WaitForChild(currentZone, 30);
		if (!zone) return;

		this.portals.clear();

		const portalsFolder = zone.WaitForChild("Portals");

		const portalsConnection = portalsFolder.ChildAdded.Connect((portal) => {
			if (portal.IsA("Model")) {
				this.portals.push(portal);
			}
		});

		for (const portal of portalsFolder.GetChildren()) {
			if (portal.IsA("Model")) {
				this.portals.push(portal);
			}
		}

		return () => {
			portalsConnection.Disconnect();
		};
	}
}

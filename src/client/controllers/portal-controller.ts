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
		store.subscribe(selectPlayerCurrentZone(tostring(Players.LocalPlayer.UserId)), (currentZone) => {
			if (currentZone === undefined) {
				return;
			}

			const zone = this.zonesFolder.FindFirstChild(currentZone);
			if (!zone) return;

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
		});
	}

	onTick(): void {
		if (this.portals.isEmpty()) return;

		this.portals.forEach((portal) => {
			const position = portal.GetPivot().Position;
			const distance = Players.LocalPlayer.DistanceFromCharacter(position);
			const isClose = distance <= 10;

			if (isClose && !this.openedMenu) {
				this.openedMenu = true;
				store.setPortalVisible(true);
			} else if (!isClose && this.openedMenu) {
				this.openedMenu = false;
				store.setPortalVisible(false);
			}
		});
	}
}

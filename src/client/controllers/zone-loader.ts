import { Controller, OnStart } from "@flamework/core";
import { Players, Workspace } from "@rbxts/services";
import { Zone, ZonesFolder } from "@/@types/models/zone";
import { store } from "@/client/store";
import { PlayerZones } from "@/shared/store/players";
import { selectPlayerZones } from "@/shared/store/players/zones";

@Controller()
export class ZoneLoader implements OnStart {
	private camera = Workspace.CurrentCamera as Camera;
	private player = Players.LocalPlayer;
	private zonesFolder = Workspace.WaitForChild("Zones") as ZonesFolder;

	onStart(): void {
		const selectLocalPlayerZones = selectPlayerZones(tostring(this.player.UserId));

		store.subscribe(selectLocalPlayerZones, (zones, previousZone) => this.onZoneChange(zones, previousZone));

		const zones = store.getState(selectLocalPlayerZones);

		if (zones) {
			this.onZoneChange(zones);
		}
	}

	private onZoneChange(zones?: PlayerZones, previousZone?: PlayerZones) {
		if (
			zones?.current === undefined ||
			!this.player.Character ||
			(zones.current === previousZone?.current && !zones.changing)
		) {
			return;
		}

		const zone = this.zonesFolder.FindFirstChild(zones.current) as Zone | undefined;
		if (!zone) {
			return;
		}

		const spawn = zone.WaitForChild("Spawn") as Part;
		const cameraPosition = this.camera.CFrame.Position;
		this.camera.CFrame = new CFrame(cameraPosition, cameraPosition.add(spawn.CFrame.LookVector));

		store.setProgress({
			progress: 100,
			status: "Loaded zone!",
		});
	}
}

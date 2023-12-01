import { Controller, OnStart } from "@flamework/core";
import { Players, Workspace } from "@rbxts/services";
import { store } from "@/client/store";
import { selectPlayerZones } from "@/shared/store/players";

interface Zone extends Instance {
	Map: Folder;
	Spawn: Part;
	Nodes: {
		GetChildren(): Part[];
	} & Folder;
}

interface ZonesFolder extends Folder {
	GetChildren(): (Zone & Instance)[];
}

@Controller()
export class ZoneLoader implements OnStart {
	private camera = Workspace.CurrentCamera as Camera;
	private player = Players.LocalPlayer;
	private zonesFolder = Workspace.WaitForChild("Zones") as ZonesFolder;

	onStart(): void {
		store.subscribe(selectPlayerZones(tostring(this.player.UserId)), (zones, previousZone) => {
			if (zones?.current === undefined || !this.player.Character || zones.current === previousZone?.current) {
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
		});
	}
}

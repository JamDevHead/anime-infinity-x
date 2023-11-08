import { OnStart, Service } from "@flamework/core";
import { ReplicatedStorage, Workspace } from "@rbxts/services";

interface ZonesFolder extends Folder {
	GetChildren(): ({
		Map: Folder;
		Spawn: Part;
		Nodes: {
			GetChildren(): Part[];
		} & Folder;
	} & Instance)[];
}

@Service()
export class ZonesLoader implements OnStart {
	public zonesFolder = new Instance("Folder") as ZonesFolder;

	onStart() {
		this.zonesFolder.Name = "Zones";
		this.zonesFolder.Parent = Workspace;

		const assets = ReplicatedStorage.assets;
		const zones = assets.Zones;

		for (const zone of zones.GetChildren()) {
			const clonedZone = zone.Clone();
			clonedZone.Parent = this.zonesFolder;
		}
	}
}

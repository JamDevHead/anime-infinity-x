import { OnStart, Service } from "@flamework/core";
import { Logger } from "@rbxts/log";
import { ServerStorage, Workspace } from "@rbxts/services";
import { ZonesLoader } from "./zones-loader";
import { Zone } from "@/@types/models/zone";

@Service()
export class EnemySpawner implements OnStart {
	public enemiesFolder = new Instance("Folder");

	private npcModels = ServerStorage.assets.Avatars.NPCsModels;

	constructor(
		private logger: Logger,
		private readonly zonesLoader: ZonesLoader,
	) {}

	onStart() {
		this.enemiesFolder.Name = "Enemies";
		this.enemiesFolder.Parent = Workspace;

		for (const zone of this.zonesLoader.zonesFolder.GetChildren()) {
			this.setupZone(zone);
		}

		this.zonesLoader.zonesFolder.ChildAdded.Connect((zone) => {
			this.setupZone(zone as Zone);
		});
	}

	private setupZone(zone: Zone) {
		const npcZone = this.npcModels.FindFirstChild(zone.Name);

		if (npcZone === undefined) {
			this.logger.Warn("Failed to find npc zone {npcZone}", zone.Name);
			return;
		}

		const nodesFolder = zone.FindFirstChild("Nodes") as Zone["Nodes"] | undefined;

		if (nodesFolder === undefined) {
			this.logger.Warn("Zone {zone} doesn't have a nodes folder", zone.Name);
			return;
		}

		for (const node of nodesFolder.GetChildren()) {
			node.SetAttribute("EnemyZone", zone.Name);
			node.AddTag("EnemySpawner");
		}
	}
}

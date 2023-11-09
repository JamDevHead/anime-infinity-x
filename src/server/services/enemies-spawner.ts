import { OnStart, Service } from "@flamework/core";
import { Logger } from "@rbxts/log";
import { ServerStorage, Workspace } from "@rbxts/services";
import { ZonesLoader } from "./zones-loader";

@Service()
export class EnemiesSpawner implements OnStart {
	public enemiesFolder = new Instance("Folder");

	constructor(
		private logger: Logger,
		private readonly zonesLoader: ZonesLoader,
	) {}

	onStart() {
		const npcModels = ServerStorage.assets.Avatars.NPCsModels;

		this.enemiesFolder.Name = "Enemies";
		this.enemiesFolder.Parent = Workspace;

		for (const zone of this.zonesLoader.zonesFolder.GetChildren()) {
			const npcZone = npcModels.FindFirstChild(zone.Name);

			if (npcZone === undefined) {
				this.logger.Warn("Failed to find npc zone {npcZone}", zone.Name);
				continue;
			}

			for (const node of zone.Nodes.GetChildren()) {
				node.SetAttribute("EnemyZone", zone.Name);
				node.AddTag("EnemySpawner");
			}
		}
	}
}

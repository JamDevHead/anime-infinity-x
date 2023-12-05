import { Controller, OnStart, OnTick } from "@flamework/core";
import { Logger } from "@rbxts/log";
import { Players, Workspace } from "@rbxts/services";
import { ZonesFolder } from "@/@types/models/zone";
import { store } from "@/client/store";
import { selectPlayerZones } from "@/shared/store/players";

@Controller()
export class EggController implements OnStart, OnTick {
	private zonesFolder = Workspace.WaitForChild("Zones") as ZonesFolder;
	private distanceCheck: RBXScriptConnection | undefined;

	private eggs?: Folder;

	constructor(private readonly logger: Logger) {}

	onStart(): void {
		if (!this.zonesFolder) {
			this.logger.Error("Zones folder not found");
			return;
		}

		store.subscribe(selectPlayerZones(tostring(Players.LocalPlayer.UserId)), (currentZones, oldZones) => {
			print(currentZones, oldZones);

			if (currentZones?.current === undefined) return;

			if (currentZones?.current === oldZones?.current) return;

			const zone = this.zonesFolder.FindFirstChild(currentZones?.current);
			if (!zone) return;

			this.eggs = zone.WaitForChild("Eggs") as Folder;
		});
	}

	onTick(): void {
		this.eggs?.GetChildren().forEach((egg) => {
			const position = (egg as Model).GetPivot().Position;

			const distance = Players.LocalPlayer.DistanceFromCharacter(position);

			print(distance, distance <= 10);

			store.setEggOpen(distance <= 10);
		});
	}
}

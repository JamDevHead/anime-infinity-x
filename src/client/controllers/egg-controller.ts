import { Controller, OnStart, OnTick } from "@flamework/core";
import { Logger } from "@rbxts/log";
import { Players, Workspace } from "@rbxts/services";
import { ZonesFolder } from "@/@types/models/zone";
import { store } from "@/client/store";
import { selectPlayerZones } from "@/shared/store/players";

@Controller()
export class EggController implements OnStart, OnTick {
	private zonesFolder = Workspace.WaitForChild("Zones") as ZonesFolder;

	private eggOpen = false;
	private eggs = [] as Model[];

	constructor(private readonly logger: Logger) {}

	onStart(): void {
		if (!this.zonesFolder) {
			this.logger.Error("Zones folder not found");
			return;
		}

		store.subscribe(selectPlayerZones(tostring(Players.LocalPlayer.UserId)), (currentZones, oldZones) => {
			if (currentZones?.current === undefined) return;
			if (currentZones?.current === oldZones?.current && currentZones.changing) return;

			const zone = this.zonesFolder.FindFirstChild(currentZones?.current);
			if (!zone) return;

			const eggsFolder = zone.WaitForChild("Eggs") as Folder;

			const eggConnection = eggsFolder.ChildAdded.Connect((egg) => {
				if (egg.IsA("Model")) {
					this.eggs.push(egg);
				}
			});

			for (const egg of eggsFolder.GetChildren()) {
				if (egg.IsA("Model")) {
					this.eggs.push(egg);
				}
			}

			return () => {
				eggConnection.Disconnect();
			};
		});
	}

	onTick(): void {
		if (this.eggs.isEmpty()) {
			return;
		}

		this.eggs.forEach((egg) => {
			const position = egg.GetPivot().Position;
			const distance = Players.LocalPlayer.DistanceFromCharacter(position);
			const isClose = distance <= 10;

			if (isClose && !this.eggOpen) {
				this.eggOpen = true;
				store.setEggOpen(true);
			} else if (!isClose && this.eggOpen) {
				this.eggOpen = false;
				store.setEggOpen(false);
			}
		});
	}
}

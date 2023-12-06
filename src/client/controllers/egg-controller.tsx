import { Controller, OnStart, OnTick } from "@flamework/core";
import { Logger } from "@rbxts/log";
import { createPortal, createRoot } from "@rbxts/react-roblox";
import Roact from "@rbxts/roact";
import { Players, Workspace } from "@rbxts/services";
import { ZonesFolder } from "@/@types/models/zone";
import { EggProvider } from "@/client/components/react/egg/egg-provider";
import { SoundController } from "@/client/controllers/sound-controller";
import { store } from "@/client/store";
import { RootProvider } from "@/client/ui/providers/root-provider";
import { PlayerZones, selectPlayerZones } from "@/shared/store/players";

@Controller()
export class EggController implements OnStart, OnTick {
	private zonesFolder = Workspace.WaitForChild("Zones") as ZonesFolder;

	private eggOpen?: Model;
	private eggs = [] as Model[];

	constructor(
		private readonly logger: Logger,
		private readonly soundController: SoundController,
	) {}

	onStart(): void {
		const root = createRoot(new Instance("Folder"));

		root.render(
			createPortal(
				<RootProvider>
					<EggProvider soundController={this.soundController} />
				</RootProvider>,
				Workspace.CurrentCamera as Camera,
			),
		);

		store.subscribe(selectPlayerZones(tostring(Players.LocalPlayer.UserId)), (currentZones, oldZones) =>
			this.onZoneChange(currentZones, oldZones),
		);

		const zones = store.getState(selectPlayerZones(tostring(Players.LocalPlayer.UserId)));
		this.onZoneChange(zones, undefined);
	}

	onTick(): void {
		if (this.eggs.isEmpty()) {
			return;
		}

		this.eggs.forEach((egg) => {
			const position = egg.GetPivot().Position;
			const distance = Players.LocalPlayer.DistanceFromCharacter(position);
			const isClose = distance <= 10;

			if (isClose && this.eggOpen === undefined) {
				this.eggOpen = egg;
				store.setEggOpen(true);
			} else if (!isClose && this.eggOpen !== undefined) {
				this.eggOpen = undefined;
				store.setEggOpen(false);
			}
		});
	}

	private onZoneChange(currentZones: PlayerZones | undefined, oldZones: PlayerZones | undefined) {
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
	}
}

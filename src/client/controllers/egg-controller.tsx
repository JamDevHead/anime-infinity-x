import { Controller, OnStart, OnTick } from "@flamework/core";
import { createPortal, createRoot } from "@rbxts/react-roblox";
import Roact from "@rbxts/roact";
import { Players, Workspace } from "@rbxts/services";
import { ZonesFolder } from "@/@types/models/zone";
import { EggProvider } from "@/client/components/react/egg/egg-provider";
import { SoundController } from "@/client/controllers/sound-controller";
import { store } from "@/client/store";
import { selectEggQueue } from "@/client/store/egg-queue/egg-queue-selectors";
import { RootProvider } from "@/client/ui/providers/root-provider";
import remotes from "@/shared/remotes";
import { PlayerZones, selectPlayerZones } from "@/shared/store/players";

@Controller()
export class EggController implements OnStart, OnTick {
	private zonesFolder = Workspace.WaitForChild("Zones") as ZonesFolder;
	private eggOpen?: Model;
	private incubators = [] as Model[];

	constructor(private readonly soundController: SoundController) {}

	onStart(): void {
		const root = createRoot(new Instance("Folder"));

		root.render(
			createPortal(
				<RootProvider>
					<EggProvider />
				</RootProvider>,
				Workspace.CurrentCamera as Camera,
			),
		);

		store.observe(selectEggQueue, (eggZone) => {
			const [success, fighter] = remotes.eggs.open.request(eggZone).timeout(10).await();

			if (!success || !fighter) {
				store.removeFromEggQueue(eggZone);
				return;
			}

			store.setHudVisible(false);
			store.addEggPurchase(fighter);

			return () => {
				this.soundController.tracker.play("reward");
				task.wait(2);
				store.setHudVisible(true);
				store.removeEggPurchase(fighter);
			};
		});

		store.subscribe(selectPlayerZones(tostring(Players.LocalPlayer.UserId)), (currentZones, oldZones) =>
			this.onZoneChange(currentZones, oldZones),
		);

		const zones = store.getState(selectPlayerZones(tostring(Players.LocalPlayer.UserId)));
		this.onZoneChange(zones, undefined);
	}

	onTick(): void {
		if (this.incubators.isEmpty()) {
			return;
		}

		this.incubators.forEach((egg) => {
			const position = egg.GetPivot().Position;
			const distance = Players.LocalPlayer.DistanceFromCharacter(position);
			const isClose = distance !== 0 && distance <= 10;

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
				this.incubators.push(egg);
			}
		});

		for (const egg of eggsFolder.GetChildren()) {
			if (egg.IsA("Model")) {
				this.incubators.push(egg);
			}
		}

		return () => {
			eggConnection.Disconnect();
		};
	}
}

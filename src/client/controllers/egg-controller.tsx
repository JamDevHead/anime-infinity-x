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
import { selectPlayerCurrentZone } from "@/shared/store/players/zones/zones-selectors";

@Controller()
export class EggController implements OnStart, OnTick {
	private zonesFolder = Workspace.WaitForChild("Zones") as ZonesFolder;
	private eggOpen?: Model;
	private incubators = [] as Model[];

	constructor(private readonly soundController: SoundController) {}

	onStart(): void {
		const root = createRoot(new Instance("Folder"));
		const queue: string[] = [];

		root.render(
			createPortal(
				<RootProvider>
					<EggProvider />
				</RootProvider>,
				Workspace.CurrentCamera as Camera,
			),
		);

		store.observe(
			selectEggQueue,
			(fighter) => fighter.uid,
			(fighter) => {
				const id = fighter.uid;

				queue.push(id);
				let currentInQueue = queue[0];

				if (currentInQueue !== id) {
					while (currentInQueue !== id) {
						task.wait();
						currentInQueue = queue[0];
					}
				}

				store.setHudVisible(false);
				store.addEggPurchase(fighter, fighter.eggZone);

				return () => {
					this.soundController.tracker.play("reward");
					task.wait(2);

					queue.remove(0);
					store.removeEggPurchase(fighter);
					store.setHudVisible(true);
				};
			},
		);

		remotes.eggs.requestToOpen.connect((fighter) => {
			store.addToEggQueue(fighter, "Special");
		});

		store.subscribe(selectPlayerCurrentZone(tostring(Players.LocalPlayer.UserId)), (currentZone) =>
			this.onZoneChange(currentZone),
		);

		const zone = store.getState(selectPlayerCurrentZone(tostring(Players.LocalPlayer.UserId)));
		this.onZoneChange(zone);
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

	private onZoneChange(currentZone: string | undefined) {
		if (currentZone === undefined) return;

		const zone = this.zonesFolder.WaitForChild(currentZone, 30);
		if (!zone) return;

		this.incubators.clear();

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

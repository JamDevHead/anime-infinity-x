import { OnStart, Service } from "@flamework/core";
import { Logger } from "@rbxts/log";
import { ReplicatedStorage, Workspace } from "@rbxts/services";
import { Zone, ZonesFolder } from "@/@types/models/zone";
import { OnCharacterAdd } from "@/server/services/lifecycles/on-character-add";
import { OnPlayerAdd } from "@/server/services/lifecycles/on-player-add";
import { store } from "@/server/store";
import { selectPlayerCurrentZone } from "@/shared/store/players/zones/zones-selectors";

const FAR_CF = new CFrame(0, 3e8, 0);

@Service()
export class ZonesLoaderService implements OnStart, OnPlayerAdd, OnCharacterAdd {
	public zonesFolder = new Instance("Folder") as ZonesFolder;
	private zonesSubscriptions = new Map<Player, () => void>();

	constructor(private readonly logger: Logger) {}

	onStart() {
		this.zonesFolder.Name = "Zones";
		this.zonesFolder.Parent = Workspace;

		const assets = ReplicatedStorage.assets;
		const zones = assets.Zones;
		const START_POSITION = Vector3.zero;
		const ZONE_DIRECTION = Vector3.xAxis;
		const ZONE_DISTANCE_MULTI = 3;
		const zonesPosition = new Map<number, Vector3>();
		let index = 0;

		for (const zone of zones.GetChildren()) {
			index++;

			const clonedZone = zone.Clone();

			// Transform zone folder to model, so we can position it
			const zoneModel = new Instance("Model");
			zoneModel.Name = zone.Name;

			clonedZone.GetChildren().forEach((mapChild) => {
				mapChild.Parent = zoneModel;
			});

			clonedZone.Destroy();

			const [zoneCenter, zoneSize] = zoneModel.GetBoundingBox();
			const zoneSizeInDirection = zoneSize.mul(new Vector3(1, 0, 1)).Magnitude * ZONE_DISTANCE_MULTI;

			const lastGoal = zonesPosition.get(index - 1);
			const goal =
				lastGoal !== undefined
					? lastGoal.add(ZONE_DIRECTION.mul(zoneSizeInDirection))
					: ZONE_DIRECTION.mul(zoneSizeInDirection * index);

			zonesPosition.set(index, goal);

			zoneModel.WorldPivot = zoneCenter;
			zoneModel.PivotTo(new CFrame(START_POSITION.add(goal)));

			zoneModel.Parent = this.zonesFolder;
		}
	}

	onPlayerAdded(player: Player) {
		const unsubscribe = store.subscribe(selectPlayerCurrentZone(tostring(player.UserId)), (currentZone) => {
			if (currentZone === undefined || !player.Character) {
				return;
			}

			print(player.Name, "changed zone", currentZone);
			this.spawnOnZone(player, player.Character, currentZone);
		});

		this.zonesSubscriptions.set(player, unsubscribe);
	}

	onPlayerRemoved(player: Player) {
		this.zonesSubscriptions.get(player)?.();
		this.zonesSubscriptions.delete(player);
	}

	onCharacterAdded(player: Player, character: Model) {
		const currentZone = store.getState(selectPlayerCurrentZone(tostring(player.UserId)));

		this.logger.Debug(`Player ${player.Name} is on zone ${currentZone}`);

		if (currentZone === undefined) {
			return;
		}

		this.spawnOnZone(player, character, currentZone);
	}

	spawnOnZone(player: Player, character: Model, zoneName: string) {
		const zone = this.zonesFolder.FindFirstChild(zoneName) as Zone | undefined;

		if (!zone) {
			return;
		}

		store.setChangingZone(tostring(player.UserId), true);

		if (character.Parent === undefined) {
			while (character.Parent === undefined) {
				task.wait();
			}
		}

		const root = character.WaitForChild("HumanoidRootPart") as Part;
		root.Anchored = true;

		character.PivotTo(FAR_CF);

		this.logger.Debug("Spawning {@player} on zone {zone}", character.GetFullName(), zoneName);

		const spawnOffset = Vector3.yAxis.mul(3 + zone.Spawn.Size.Y / 2);
		const spawnCFrame = zone.Spawn.CFrame.add(spawnOffset);

		player.RequestStreamAroundAsync(spawnCFrame.Position);

		character.PivotTo(spawnCFrame);
		if (root) {
			root.Anchored = false;
		}

		//task.wait(1);
		store.setChangingZone(tostring(player.UserId), false);
	}
}

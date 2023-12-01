import { OnStart, Service } from "@flamework/core";
import { Logger } from "@rbxts/log";
import { Players, ReplicatedStorage, Workspace } from "@rbxts/services";
import { OnCharacterAdd } from "@/server/services/lifecycles/on-character-add";
import { OnPlayerAdd } from "@/server/services/lifecycles/on-player-add";
import { store } from "@/server/store";
import { selectPlayerZones } from "@/shared/store/players";

interface Zone {
	Map: Folder;
	Spawn: Part;
	Nodes: {
		GetChildren(): Part[];
	} & Folder;
}

interface ZonesFolder extends Folder {
	GetChildren(): (Zone & Instance)[];
}

@Service()
export class ZonesLoader implements OnStart, OnPlayerAdd, OnCharacterAdd {
	public zonesFolder = new Instance("Folder") as ZonesFolder;
	private zonesSubscriptions = new Map<Player, () => void>();

	constructor(private readonly logger: Logger) {}

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

	onPlayerAdded(player: Player) {
		const unsubscribe = store.subscribe(selectPlayerZones(tostring(player.UserId)), (zones) => {
			if (zones?.current === undefined || !player.Character) {
				return;
			}

			this.spawnOnZone(player.Character, zones.current);
		});

		this.zonesSubscriptions.set(player, unsubscribe);
	}

	onPlayerRemoved(player: Player) {
		this.zonesSubscriptions.get(player)?.();
		this.zonesSubscriptions.delete(player);
	}

	onCharacterAdded(player: Player, character: Model) {
		const zones = store.getState(selectPlayerZones(tostring(player.UserId)));

		this.logger.Debug(`Player ${player.Name} is on zone ${zones?.current}`);

		if (!zones || zones.current === undefined) {
			return;
		}

		this.spawnOnZone(character, zones.current);
	}

	spawnOnZone(character: Model, zoneName: string) {
		const zone = this.zonesFolder.FindFirstChild(zoneName) as Zone | undefined;

		if (!zone) {
			return;
		}

		if (character.Parent === undefined) {
			while (character.Parent === undefined) {
				task.wait();
			}
		}

		const player = Players.GetPlayerFromCharacter(character);

		store.setChangingZone(tostring(player?.UserId), true);

		this.logger.Debug("Spawning {@player} on zone {zone}", character.GetFullName(), zoneName);

		const spawnOffset = Vector3.yAxis.mul(3 + zone.Spawn.Size.Y / 2);
		character.PivotTo(zone.Spawn.CFrame.add(spawnOffset));

		//task.wait(1);
		store.setChangingZone(tostring(player?.UserId), false);
	}
}

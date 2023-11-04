import { OnStart, Service } from "@flamework/core";
import { GetProfileStore } from "@rbxts/profileservice";
import { Profile, ProfileStore } from "@rbxts/profileservice/globals";
import { PlayerData } from "@/shared/reflex/slices/players/types";
import { defaultPlayerData } from "@/shared/reflex/slices/players/utils";
import { OnPlayerAdd } from "@/server/services/lifecycles/on-player-add";
import { Logger } from "@rbxts/log";
import { Players } from "@rbxts/services";
import { producer } from "@/server/reflex/producers";
import { selectPlayerData } from "@/shared/reflex/selectors";

@Service()
export class ProfileLoad implements OnStart, OnPlayerAdd {
	private profileStore?: ProfileStore<PlayerData>;
	private profiles = new Map<Player, Profile<PlayerData>>();

	constructor(private logger: Logger) {}

	onStart() {
		this.profileStore = GetProfileStore({ Name: "PlayerData", Scope: "DEV" }, defaultPlayerData);
	}

	private waitForProfileStore() {
		if (!this.profileStore) {
			this.logger.Debug("Profile store is still loading");

			while (!this.profileStore) {
				task.wait();
			}
		}
	}

	onPlayerAdded(player: Player) {
		this.waitForProfileStore();

		const profile = this.profileStore!.LoadProfileAsync(`Data_${player.UserId}`, "ForceLoad");

		if (!profile) {
			player.Kick("todo label: Profile doesn't exist");
			return;
		}

		profile.AddUserId(player.UserId);
		profile.Reconcile();

		const playerId = tostring(player.UserId);

		const unsubscribe = producer.subscribe(selectPlayerData(playerId), (data) => {
			if (data) {
				profile.Data = data;
			}
		});

		profile.ListenToRelease(() => {
			unsubscribe();
			this.profiles.delete(player);
			player.Kick("todo label: Profile released");
		});

		if (!player.IsDescendantOf(Players)) {
			profile.Release();
			return;
		}

		producer.loadPlayerData(playerId, profile.Data);

		this.logger.Info(`${player.Name} profile loaded {@data}`, profile.Data);
		this.profiles.set(player, profile);
	}

	onPlayerRemoved(player: Player) {
		const profile = this.profiles.get(player);
		profile?.Release();

		producer.unloadPlayerData(tostring(player.UserId));

		this.profiles.delete(player);
	}
}

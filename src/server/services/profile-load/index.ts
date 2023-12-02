import { OnStart, Service } from "@flamework/core";
import { Logger } from "@rbxts/log";
import { GetProfileStore } from "@rbxts/profileservice";
import { Profile, ProfileStore } from "@rbxts/profileservice/globals";
import { Players } from "@rbxts/services";
import { OnPlayerAdd } from "@/server/services/lifecycles/on-player-add";
import { loadPlayerData } from "@/server/services/profile-load/loaders";
import { store } from "@/server/store";
import { defaultPlayerData, PlayerData, selectPlayerData } from "@/shared/store/players";

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

		const profile = this.profileStore?.LoadProfileAsync(`Data_${player.UserId}`, "ForceLoad");

		if (!profile) {
			player.Kick("todo label: Profile doesn't exist");
			return;
		}

		profile.AddUserId(player.UserId);
		profile.Reconcile();
		loadPlayerData(player, profile, this.logger);

		const playerId = tostring(player.UserId);

		const unsubscribe = store.subscribe(selectPlayerData(playerId), (data) => {
			if (data !== undefined) {
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

		const t0 = os.clock();

		store.loadPlayerData(playerId, profile.Data);

		const t1 = os.clock();

		this.logger.Info(`${player.Name} profile loaded in {time}s`, math.round((t1 - t0) * 1000) / 1000);
		print(`${player.Name} data:`, profile.Data, `in ${t1 - t0}`);
		this.profiles.set(player, profile);
	}

	onPlayerRemoved(player: Player) {
		const profile = this.profiles.get(player);
		profile?.Release();

		store.unloadPlayerData(tostring(player.UserId));

		this.profiles.delete(player);
	}

	public getProfile(player: Player) {
		return this.profiles.get(player);
	}

	public setPlayerData<T extends keyof PlayerData>(player: Player, key: T, value: PlayerData[T]) {
		const profile = this.profiles.get(player);
		profile?.Data && (profile.Data[key] = value);
	}

	public getPlayerData<T extends keyof PlayerData>(player: Player, key: T) {
		const profile = this.profiles.get(player);
		return profile?.Data && profile.Data[key];
	}

	public getProfiles() {
		return this.profiles;
	}
}

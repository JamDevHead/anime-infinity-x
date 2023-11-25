import { OnStart, Service } from "@flamework/core";
import { Connection, Signal } from "@rbxts/beacon";
import { Logger } from "@rbxts/log";
import { HttpService } from "@rbxts/services";
import { setInterval } from "@rbxts/set-timeout";
import { Config, ConfigType } from "@/@types/models/remote-config";
import { env } from "@/server/constants/env";
import { IS_PRODUCTION } from "@/shared/constants/core";

@Service()
export class RemoteConfig implements OnStart {
	private config: Config = {};
	private channel = IS_PRODUCTION ? "production" : "canary";
	private onFetched = new Signal<void>();

	private listeners = new Set<Connection<void>>();

	constructor(private logger: Logger) {}

	onStart(): void | Promise<void> {
		try {
			this.retrieveConfig();

			// Fetch remote config every 30 minutes
			setInterval(
				() => {
					this.retrieveConfig();
				},
				60 * 1000 * 30,
			);

			this.logger.Info("Successfully fetched remote config");
		} catch (error) {
			this.logger.Warn(`Failed to fetch remote config: ${error}`);
		}
	}

	private retrieveConfig() {
		this.config.world = this.fetchConfig("world");
		this.config.characters = this.fetchConfig("characters");
		this.onFetched.Fire();
	}

	/**
	 * Gets a config from the remote config
	 * @example getConfig("world") // returns Promise<WorldConfigSchema>
	 * @param configType - The type of the config you want to get
	 * @returns The config you want to get
	 */
	public async getConfig<T extends ConfigType>(configType: T): Promise<Config[T]> {
		if (this.config[configType] === undefined) {
			return new Promise<Config[T]>((resolve) => {
				// Create a thread to fetch the config in the background
				const connection = this.onFetched.Connect(() => {
					resolve(this.config[configType]);
					connection.Disconnect();
				});
			});
		}

		return this.config[configType] as Config[T];
	}

	private fetchConfig<T extends ConfigType>(_configType: T): Config[T] {
		const response = HttpService.RequestAsync({
			Url: `https://raw.githubusercontent.com/JamDevHead/aix-remote-config/main/${this.channel}/${_configType}.json`,
			Method: "GET",
			Headers: {
				"Content-Type": "application/json",
				Authorization: `Bearer ${env.REMOTE_CONFIG_TOKEN}`,
			},
		});

		if (response.Success) {
			return HttpService.JSONDecode(response.Body) as Config[T];
		}

		throw response.StatusCode;
	}

	public observe(listener: () => void): Connection<void> {
		const connection = this.onFetched.Connect(listener);
		this.listeners.add(connection);
		return connection;
	}

	public dispose(connection: Connection<void>) {
		this.listeners.delete(connection);
		connection.Disconnect();
	}

	public clear() {
		this.listeners.forEach((connection) => connection.Disconnect());
		this.listeners.clear();
	}
}

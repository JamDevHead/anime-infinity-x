import { Modding, OnInit, Service } from "@flamework/core";
import { RemoteConfig } from "@/server/services/remote-config";

export interface OnRemoteConfigUpdate {
	onRemoteConfigUpdate?(): void;
}

/**
 * @internal
 */
@Service()
class _RemoteConfigUpdate implements OnInit {
	private listeners = new Set<OnRemoteConfigUpdate>();

	constructor(private remoteConfig: RemoteConfig) {}

	onInit(): void | Promise<void> {
		Modding.onListenerAdded<OnRemoteConfigUpdate>((listener) => this.listeners.add(listener));
		Modding.onListenerRemoved<OnRemoteConfigUpdate>((listener) => this.listeners.delete(listener));

		this.remoteConfig.observe(() => this.onRemoteConfigUpdate());
	}

	onRemoteConfigUpdate() {
		for (const listener of this.listeners) {
			task.spawn(() => listener.onRemoteConfigUpdate?.());
		}
	}
}

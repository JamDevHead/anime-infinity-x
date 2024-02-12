import { Modding, OnInit, Service } from "@flamework/core";
import { RemoteConfigService } from "@/server/services/remote-config-service";

export interface OnRemoteConfigUpdate {
	onRemoteConfigUpdate?(): void;
}

/**
 * @internal
 */
@Service()
class _RemoteConfigUpdate implements OnInit {
	private listeners = new Set<OnRemoteConfigUpdate>();

	constructor(private remoteConfig: RemoteConfigService) {}

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

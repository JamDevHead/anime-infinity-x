import { Modding, OnInit, Service } from "@flamework/core";
import { Players } from "@rbxts/services";

export interface OnPlayerAdd {
	onPlayerAdded?(player: Player): void;
	onPlayerRemoved?(player: Player): void;
}

@Service()
class PlayerAdd implements OnInit {
	private listeners = new Set<OnPlayerAdd>();

	onInit(): void | Promise<void> {
		Modding.onListenerAdded<OnPlayerAdd>((listener) => this.listeners.add(listener));
		Modding.onListenerRemoved<OnPlayerAdd>((listener) => this.listeners.delete(listener));

		Players.PlayerAdded.Connect((player) => this.onPlayerAdded(player));
		Players.PlayerRemoving.Connect((player) => this.onPlayerRemoved(player));

		for (const player of Players.GetPlayers()) {
			task.spawn(() => this.onPlayerAdded(player));
		}
	}

	onPlayerAdded(player: Player) {
		for (const listener of this.listeners) {
			task.spawn(() => listener.onPlayerAdded?.(player));
		}
	}

	onPlayerRemoved(player: Player) {
		for (const listener of this.listeners) {
			task.spawn(() => listener.onPlayerRemoved?.(player));
		}
	}
}

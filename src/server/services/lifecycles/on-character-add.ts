import { Modding, OnInit, Service } from "@flamework/core";
import { OnPlayerAdd } from "@/server/services/lifecycles/on-player-add";

export interface OnCharacterAdd {
	onCharacterAdded?(player: Player, character: Model): void;
	onCharacterRemoved?(player: Player, character: Model): void;
}

@Service()
class _CharacterAdd implements OnInit, OnPlayerAdd {
	private listeners = new Set<OnCharacterAdd>();
	private signalConnections = new Map<Player, Set<RBXScriptConnection>>();

	onInit(): void | Promise<void> {
		Modding.onListenerAdded<OnCharacterAdd>((listener) => this.listeners.add(listener));
		Modding.onListenerRemoved<OnCharacterAdd>((listener) => this.listeners.delete(listener));
	}

	onPlayerAdded(player: Player) {
		const connections = new Set<RBXScriptConnection>();

		this.signalConnections.set(player, connections);

		connections.add(player.CharacterAdded.Connect((character) => this.onCharacterAdded(player, character)));
		connections.add(player.CharacterRemoving.Connect((character) => this.onCharacterRemoved(player, character)));

		if (player.Character === undefined) {
			return;
		}

		this.onCharacterAdded(player, player.Character);
	}

	onPlayerRemoved(player: Player) {
		// free connections
		this.signalConnections.get(player)?.forEach((connection) => connection.Disconnect());
		this.signalConnections.delete(player);
	}

	onCharacterAdded(player: Player, character: Model) {
		for (const listener of this.listeners) {
			task.spawn(() => listener.onCharacterAdded?.(player, character));
		}
	}

	onCharacterRemoved(player: Player, character: Model) {
		for (const listener of this.listeners) {
			task.spawn(() => listener.onCharacterRemoved?.(player, character));
		}
	}
}

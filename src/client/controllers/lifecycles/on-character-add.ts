import { Controller, Modding, OnInit } from "@flamework/core";
import { Players } from "@rbxts/services";

export interface OnCharacterAdd {
	onCharacterAdded?(character: Model): void;
	onCharacterRemoved?(character: Model): void;
}

@Controller()
export class CharacterAdd implements OnInit {
	private listeners = new Set<OnCharacterAdd>();
	public character: Player["Character"];

	onInit(): void | Promise<void> {
		Modding.onListenerAdded<OnCharacterAdd>((listener) => this.listeners.add(listener));
		Modding.onListenerRemoved<OnCharacterAdd>((listener) => this.listeners.delete(listener));

		const localPlayer = Players.LocalPlayer;

		localPlayer.CharacterAdded.Connect((character) => this.onCharacterAdded(character));
		localPlayer.CharacterRemoving.Connect((character) => this.onCharacterRemoved(character));

		task.spawn(() => {
			if (localPlayer.Character === undefined) {
				return;
			}

			this.onCharacterAdded(localPlayer.Character);
		});
	}

	onCharacterAdded(character: Model) {
		this.character = character;
		for (const listener of this.listeners) {
			task.spawn(() => listener.onCharacterAdded?.(character));
		}
	}

	onCharacterRemoved(character: Model) {
		this.character = undefined;
		for (const listener of this.listeners) {
			task.spawn(() => listener.onCharacterRemoved?.(character));
		}
	}
}

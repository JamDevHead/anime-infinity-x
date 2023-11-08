import { Controller, Modding, OnInit } from "@flamework/core";
import { UserInputService } from "@rbxts/services";

export interface OnInput {
	onInputBegan(input: InputObject, gameProcessedEvent: boolean): void;
	onInputEnded(input: InputObject, gameProcessedEvent: boolean): void;
}

@Controller()
class _Input implements OnInit {
	private listeners = new Set<OnInput>();

	onInit(): void | Promise<void> {
		Modding.onListenerAdded<OnInput>((listener) => this.listeners.add(listener));
		Modding.onListenerRemoved<OnInput>((listener) => this.listeners.delete(listener));

		UserInputService.InputBegan.Connect((input, gameProcessedEvent) => {
			for (const listener of this.listeners) {
				listener.onInputBegan(input, gameProcessedEvent);
			}
		});

		UserInputService.InputEnded.Connect((input, gameProcessedEvent) => {
			for (const listener of this.listeners) {
				listener.onInputEnded(input, gameProcessedEvent);
			}
		});
	}
}

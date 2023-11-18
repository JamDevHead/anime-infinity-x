import { Controller } from "@flamework/core";
import { OnCharacterAdd } from "@/client/controllers/lifecycles/on-character-add";
import { OnInput } from "@/client/controllers/lifecycles/on-input";

@Controller()
export class Sprint implements OnCharacterAdd, OnInput {
	private humanoid: Humanoid | undefined;

	onCharacterAdded(character: Model) {
		this.humanoid = character.WaitForChild("Humanoid") as unknown as Humanoid;
	}

	onCharacterRemoved() {
		this.humanoid = undefined;
	}

	isValidInput(input: InputObject) {
		return input.KeyCode === Enum.KeyCode.LeftShift || input.KeyCode === Enum.KeyCode.RightShift;
	}

	onInputBegan(input: InputObject, gameProcessedEvent: boolean) {
		if (!this.isValidInput(input) || gameProcessedEvent || this.humanoid === undefined) {
			return;
		}

		this.humanoid.WalkSpeed = 25;
	}

	onInputEnded(input: InputObject) {
		if (!this.isValidInput(input) || this.humanoid === undefined) {
			return;
		}

		this.humanoid.WalkSpeed = 16;
	}
}

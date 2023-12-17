import { Controller, OnTick } from "@flamework/core";
import { OnCharacterAdd } from "@/client/controllers/lifecycles/on-character-add";
import { HAS_KEYBOARD } from "@/client/constants/device-info";
import { UserInputService } from "@rbxts/services";

const SPEED = 25;
const DEFAULT_SPEED = 16;

@Controller()
export class SprintController implements OnCharacterAdd, OnTick {
	private humanoid: Humanoid | undefined;
	private walkingFor = 0;

	onCharacterAdded(character: Model) {
		this.humanoid = character.WaitForChild("Humanoid") as Humanoid;
	}

	onCharacterRemoved() {
		this.humanoid = undefined;
	}

	onTick(dt: number) {
		if (!this.humanoid) {
			return;
		}

		const moveDirection = math.sign(this.humanoid.MoveDirection.Magnitude);

		print("moveDirection sign:", moveDirection);
		print("walking for:", this.walkingFor);

		if (moveDirection === 1) {
			this.walkingFor += dt;
		} else if (this.walkingFor !== 0) {
			this.walkingFor = 0;
		}

		this.humanoid.WalkSpeed = this.isRequestingSprint() ? SPEED : DEFAULT_SPEED;
	}

	private isRequestingSprint() {
		return HAS_KEYBOARD
			? UserInputService.IsKeyDown(Enum.KeyCode.LeftShift) || UserInputService.IsKeyDown(Enum.KeyCode.RightShift)
			: this.walkingFor > 1;
	}
}

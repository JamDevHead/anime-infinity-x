import { OnStart, Service } from "@flamework/core";
import { PhysicsService } from "@rbxts/services";
import { OnCharacterAdd } from "@/server/services/lifecycles/on-character-add";

@Service()
export class PlayerCollisions implements OnStart, OnCharacterAdd {
	onStart() {
		PhysicsService.RegisterCollisionGroup("Players");
		PhysicsService.RegisterCollisionGroup("Enemies");

		PhysicsService.CollisionGroupSetCollidable("Players", "Players", false);
		PhysicsService.CollisionGroupSetCollidable("Players", "Enemies", false);
	}

	onCharacterAdded(player: Player, character: Model) {
		const removeCollision = (part: BasePart) => {
			part.CollisionGroup = "Players";
		};

		character.GetDescendants().forEach((descendant) => {
			if (!descendant.IsA("BasePart")) {
				return;
			}

			removeCollision(descendant);
		});

		character.DescendantAdded.Connect((descendant) => {
			if (!descendant.IsA("BasePart")) {
				return;
			}

			removeCollision(descendant);
		});
	}
}

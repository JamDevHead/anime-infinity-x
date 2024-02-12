import { OnStart, Service } from "@flamework/core";
import { PhysicsService, Workspace } from "@rbxts/services";
import { OnCharacterAdd } from "@/server/services/lifecycles/on-character-add";

@Service()
export class PlayerCollisionsService implements OnStart, OnCharacterAdd {
	private playersFolder = new Instance("Folder");

	onStart() {
		this.playersFolder.Name = "Players";
		this.playersFolder.Parent = Workspace;

		PhysicsService.RegisterCollisionGroup("Players");
		PhysicsService.RegisterCollisionGroup("Enemies");

		PhysicsService.CollisionGroupSetCollidable("Players", "Players", false);
		PhysicsService.CollisionGroupSetCollidable("Players", "Enemies", false);
	}

	onCharacterAdded(player: Player, character: Model) {
		const removeCollision = (part: BasePart) => {
			part.CollisionGroup = "Players";
		};

		task.defer(() => {
			if (!character.Parent) {
				while (!character.Parent) {
					task.wait();
				}
			}

			character.Parent = this.playersFolder;
		});

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

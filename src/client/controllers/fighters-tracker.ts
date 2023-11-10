import { Controller } from "@flamework/core";
import { Logger } from "@rbxts/log";
import { OnCharacterAdd } from "@/client/controllers/lifecycles/on-character-add";

@Controller()
export class FightersTracker implements OnCharacterAdd {
	private fightersContainers = new Set<Attachment>();

	constructor(private readonly logger: Logger) {}

	onCharacterAdded(character: Model) {
		const root = character.WaitForChild("HumanoidRootPart") as Part;
		const goals = this.getGoals(1);
		const rootOffset = new Vector3(4, -3, 3);

		for (const goalPosition of goals) {
			const goal = new Instance("Attachment");

			goal.Name = "FighterGoal";
			goal.Visible = true;

			goal.Parent = root;
			goal.Position = rootOffset.add(goalPosition);
			this.fightersContainers.add(goal);
		}
	}

	onCharacterRemoved() {
		for (const container of this.fightersContainers) {
			container.Destroy();
		}

		this.fightersContainers.clear();
	}

	private getGoals(_trooperAmount: number) {
		const goals = new Set<Vector3>();

		// TODO: dynamic goal formation based on trooper amount
		goals.add(Vector3.zero); // Center goal

		return goals;
	}
}

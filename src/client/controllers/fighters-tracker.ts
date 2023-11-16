import { Controller, OnStart } from "@flamework/core";
import { Logger } from "@rbxts/log";
import { createSelector } from "@rbxts/reflex";
import { Players } from "@rbxts/services";
import { OnCharacterAdd } from "@/client/controllers/lifecycles/on-character-add";
import { producer } from "@/client/reflex/producers";
import { selectPlayerFighters } from "@/shared/reflex/selectors";

const selectActiveFighters = (playerId: string) => {
	return createSelector(selectPlayerFighters(playerId), (fighters) => {
		return fighters?.actives;
	});
};

@Controller()
export class FightersTracker implements OnStart, OnCharacterAdd {
	private localPlayer = Players.LocalPlayer;
	private root: Part | undefined;
	private fightersContainers = new Set<Attachment>();
	private fighters: string[] = [];

	constructor(private readonly logger: Logger) {}

	onStart() {
		producer.subscribe(selectActiveFighters(tostring(this.localPlayer.UserId)), (fighters) => {
			if (!fighters) {
				return;
			}

			this.logger.Debug("Active fighters changed", fighters);

			this.fighters = fighters;
			this.updateFighters();
		});
	}

	onCharacterAdded(character: Model) {
		this.root = character.WaitForChild("HumanoidRootPart") as Part;
		this.updateFighters();
	}

	onCharacterRemoved() {
		for (const container of this.fightersContainers) {
			container.Destroy();
		}

		this.fightersContainers.clear();
	}

	private updateFighters() {
		if (!this.root?.Parent) {
			return;
		}

		this.onCharacterRemoved();

		const goals = this.getGoals();
		const rootOffset = new Vector3(4, -3, 3);

		for (const [uid, goalPosition] of goals) {
			const goal = new Instance("Attachment");

			goal.Name = "FighterGoal";
			goal.Visible = true;

			goal.Parent = this.root;
			goal.Position = rootOffset.add(goalPosition);

			this.fightersContainers.add(goal);

			goal.SetAttribute("UID", uid);
			goal.AddTag("FighterGoal");
		}
	}

	private getGoals() {
		const goals = new Map<string, Vector3>();
		let index = 1;

		// TODO: dynamic goal formation based on trooper amount
		for (const uid of this.fighters) {
			const odd = index % 2 === 0;
			const goal = Vector3.xAxis.mul(odd ? index * 3 : index * -3);

			goals.set(uid, goal);
			index++;
		}

		return goals;
	}
}

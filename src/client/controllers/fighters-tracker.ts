import { Controller, OnStart } from "@flamework/core";
import { Logger } from "@rbxts/log";
import { createSelector } from "@rbxts/reflex";
import { Players, Workspace } from "@rbxts/services";
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
	public fightersFolder = new Instance("Folder");

	private readonly RootOffset = new Vector3(0, -3, 4);
	private localPlayer = Players.LocalPlayer;
	private root: Part | undefined;
	private activeFighters = new Map<string, Attachment | false>();

	constructor(private readonly logger: Logger) {}

	onStart() {
		this.fightersFolder.Name = "Fighters";
		this.fightersFolder.Parent = Workspace;

		producer.observe(selectActiveFighters(tostring(this.localPlayer.UserId)), (uid) => {
			this.createFighter(uid);
			this.updateFighters();

			return () => {
				this.logger.Debug("Removing fighter {uid}", uid);
				this.removeFighter(uid);
				this.updateFighters();
			};
		});
	}

	onCharacterAdded(character: Model) {
		this.root = character.WaitForChild("HumanoidRootPart") as Part;
		for (const [uid] of this.activeFighters) {
			this.createFighter(uid);
		}
		this.updateFighters();
	}

	onCharacterRemoved() {
		this.root = undefined;
		this.activeFighters.forEach((goalAttachment, uid) => {
			this.activeFighters.set(uid, false);

			if (goalAttachment) {
				goalAttachment.Destroy();
			}
		});
	}

	private createFighter(uid: string) {
		let goalAttachment = this.activeFighters.get(uid);

		if (!goalAttachment && this.root) {
			goalAttachment = new Instance("Attachment");
		}

		this.activeFighters.set(uid, goalAttachment ?? false);

		if (goalAttachment) {
			goalAttachment.Name = "GoalAttachment";
			goalAttachment.Parent = this.root;
		}
	}

	private removeFighter(uid: string) {
		const attachment = this.activeFighters.get(uid);

		if (attachment) {
			attachment.Destroy();
		}

		this.activeFighters.delete(uid);
	}

	private updateFighters() {
		const troopSize = this.activeFighters.size();
		const formation = this.getFormation(troopSize);
		const formationSize = formation.size();
		let index = 0;

		for (const [uid, goalAttachment] of this.activeFighters) {
			index++;

			if (!goalAttachment) {
				continue;
			}

			const fighterGoal = formation[index % formationSize];

			goalAttachment.Position = this.RootOffset.add(fighterGoal);
			goalAttachment.SetAttribute("UID", uid);
			goalAttachment.AddTag("FighterGoal");
		}
	}

	private getFormation(troopAmount: number, spacing = 4) {
		const rows = math.ceil((math.sqrt(8 * troopAmount + 1) - 1) / 2);

		return this.generateTriangleFormation(rows, spacing);
	}

	private generateTriangleFormation(rows: number, spacing: number) {
		const formationShape: Vector3[] = [];

		const halfWidth = ((rows - 1) * spacing) / 2;

		for (let i = 0; i < rows; i++) {
			for (let j = 0; j <= i; j++) {
				let x = i * spacing - halfWidth;
				const z = j * spacing;

				if (j % 2 === 0) {
					x += spacing / 2;
				}

				formationShape.push(new Vector3(x - spacing / 2, 0, z));
			}
		}

		return formationShape;
	}
}

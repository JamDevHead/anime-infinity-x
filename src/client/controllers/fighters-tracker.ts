import { Controller, OnStart } from "@flamework/core";
import { Logger } from "@rbxts/log";
import { Players, Workspace } from "@rbxts/services";
import { selectSelectedEnemiesByPlayerId } from "shared/store/enemy-selection";
import { OnCharacterAdd } from "@/client/controllers/lifecycles/on-character-add";
import { store } from "@/client/store";
import remotes from "@/shared/remotes";
import { selectFighterTarget } from "@/shared/store/fighter-target/fighter-target-selectors";
import { selectActivePlayerFighters } from "@/shared/store/players/fighters";

@Controller()
export class FightersTracker implements OnStart, OnCharacterAdd {
	public fightersFolder = new Instance("Folder");

	private readonly RootOffset = new Vector3(0, -3, 4);
	private localPlayer = Players.LocalPlayer;
	private localUserId = tostring(this.localPlayer.UserId);
	private root: Part | undefined;
	private goalContainer = Workspace.Terrain;
	private activeFighters = new Map<string, Attachment>();

	constructor(private readonly logger: Logger) {}

	onStart() {
		this.fightersFolder.Name = "Fighters";
		this.fightersFolder.Parent = Workspace;

		store.observe(selectActivePlayerFighters(this.localUserId), (uid) => {
			this.createFighter(uid);
			this.updateFighters();

			return () => {
				this.logger.Debug("Removing fighter {uid}", uid);
				this.removeFighter(uid);
				this.updateFighters();
			};
		});

		const enemyAdded = (enemyUid: string) => {
			const doesNotHaveTarget = (enemies: string[] | undefined) => {
				return enemies?.includes(enemyUid) === false;
			};

			const cleanup = this.enemyObserver(enemyUid);

			store.once(selectSelectedEnemiesByPlayerId(this.localUserId), doesNotHaveTarget, cleanup);
		};

		store.subscribe(
			selectSelectedEnemiesByPlayerId(this.localUserId),
			(enemiesSelected, previousEnemiesSelected) => {
				if (!enemiesSelected) {
					return;
				}

				// eslint-disable-next-line roblox-ts/no-array-pairs
				for (const [enemyIndex, enemyUid] of pairs(enemiesSelected)) {
					if (previousEnemiesSelected?.[enemyIndex] !== undefined) {
						continue;
					}

					enemyAdded(enemyUid);
				}
			},
		);
	}

	onCharacterAdded(character: Model) {
		this.root = character.WaitForChild("HumanoidRootPart") as Part;
		this.updateFighters();
	}

	onCharacterRemoved() {
		this.root = undefined;
		this.activeFighters.forEach((fighterAttachment) => {
			fighterAttachment.RemoveTag("FighterGoal");
		});
		this.activeFighters.clear();
	}

	private enemyObserver(enemyUid: string) {
		this.activeFighters.forEach((_, uid) => {
			remotes.fighterTarget.set.fire(uid, enemyUid);
		});

		this.updateFighters();

		return () => {
			this.activeFighters.forEach((_, uid) => {
				const fighterTargetUid = store.getState(selectFighterTarget(uid));

				if (fighterTargetUid === undefined || fighterTargetUid !== enemyUid) {
					return;
				}

				remotes.fighterTarget.remove.fire(uid);
			});

			this.updateFighters();
		};
	}

	private createFighter(uid: string) {
		let goalAttachment = this.activeFighters.get(uid);

		if (!goalAttachment && this.goalContainer) {
			goalAttachment = new Instance("Attachment");
			goalAttachment.Name = "GoalAttachment";
			goalAttachment.Parent = this.goalContainer;
		}

		if (!goalAttachment) {
			return;
		}

		this.activeFighters.set(uid, goalAttachment);
		goalAttachment.SetAttribute("UID", uid);
	}

	private removeFighter(uid: string) {
		const attachment = this.activeFighters.get(uid);

		if (attachment) {
			attachment.Destroy();
		}

		this.activeFighters.delete(uid);
	}

	private updateFighters() {
		if (!this.root) {
			return;
		}

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
			const fighterOffset = this.RootOffset.add(fighterGoal);

			goalAttachment.WorldPosition = this.root.Position.add(fighterOffset);
			goalAttachment.SetAttribute("Offset", fighterOffset);
			goalAttachment.SetAttribute("UID", uid);
			goalAttachment.SetAttribute("OwnerId", this.localPlayer.UserId);
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

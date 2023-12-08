import { Players } from "@rbxts/services";
import { Trove } from "@rbxts/trove";
import { ActiveFighters } from "@/client/controllers/fighters-tracker/active-fighters";
import { FightersTracker } from "@/client/controllers/fighters-tracker/index";
import { store } from "@/client/store";
import { selectSelectedEnemiesByPlayerId } from "@/shared/store/enemy-selection";
import {
	selectFighterTarget,
	selectPlayerFightersTarget,
} from "@/shared/store/fighter-target/fighter-target-selectors";

export class Tracker {
	public readonly userId: string;
	private readonly localUserId = tostring(Players.LocalPlayer.UserId);

	private activeFighters: ActiveFighters;
	private trove = new Trove();
	private root: Part | undefined;

	constructor(
		player: Player,
		public fightersTracker: FightersTracker,
	) {
		this.userId = tostring(player.UserId);
		this.activeFighters = this.trove.add(new ActiveFighters(this));

		task.spawn(() => {
			if (player.Character) {
				this.onCharacter(player.Character);
			}
		});

		this.trove.add(player.CharacterAdded.Connect((character) => this.onCharacter(character)));
		// this.trove.add(
		// 	store.subscribe(selectActivePlayerFighters(this.localUserId), (activeFighters, previousActiveFighters) =>
		// 		this.updateActiveFighters(activeFighters, previousActiveFighters),
		// 	),
		// );

		if (this.userId === this.localUserId) {
			this.trove.add(
				store.subscribe(
					selectSelectedEnemiesByPlayerId(this.userId),
					(selectedEnemies, previousSelectedEnemies) =>
						this.updateSelectedEnemies(selectedEnemies, previousSelectedEnemies),
				),
			);
		} else {
			this.trove.add(
				store.observe(selectPlayerFightersTarget(this.userId), (fighter) => {
					this.updateFighters();
				}),
			);
		}
	}

	public destroy() {
		this.trove.destroy();
	}

	public onCharacterRemoving() {
		// Cleanup previous fighters
		this.activeFighters.clean();
	}

	public updateFighters() {
		if (!this.root) {
			return;
		}

		const troopSize = this.activeFighters.size();
		const formation = this.fightersTracker.getFormation(troopSize);
		const formationSize = formation.size();
		let index = 0;

		for (const [uid, goalAttachment] of this.activeFighters.fighters) {
			index++;

			if (!goalAttachment) {
				continue;
			}

			const fighterGoal = formation[index % formationSize];
			const fighterOffset = this.fightersTracker.RootOffset.add(fighterGoal);

			goalAttachment.WorldPosition = this.root.Position.add(fighterOffset);
			goalAttachment.SetAttribute("Offset", fighterOffset);
			goalAttachment.SetAttribute("UID", uid);
			goalAttachment.SetAttribute("OwnerId", this.userId);
			goalAttachment.AddTag("FighterGoal");
		}
	}

	private onCharacter(character: Model) {
		this.root = character.WaitForChild("HumanoidRootPart") as Part;
		this.updateFighters();
	}

	private updateSelectedEnemies(
		selectedEnemies: string[] | undefined,
		previousSelectedEnemies: string[] | undefined,
	) {
		if (!selectedEnemies) {
			return;
		}
		const doesNotHaveTarget = (enemyUid: string) => (enemies: string[] | undefined) => {
			return enemies?.includes(enemyUid) === false;
		};

		for (const [enemyIndex, enemyUid] of pairs(selectedEnemies)) {
			if (previousSelectedEnemies?.[enemyIndex] !== undefined) {
				continue;
			}

			const cleanup = this.onSelectedEnemy(enemyUid);

			this.trove.add(
				store.once(selectSelectedEnemiesByPlayerId(this.userId), doesNotHaveTarget(enemyUid), cleanup),
			);
		}
	}

	private onSelectedEnemy(enemyUid: string) {
		// Set all fighters target to enemy
		this.activeFighters.forEach((_, fighterUid) => {
			this.fightersTracker.setFighterTarget(fighterUid, enemyUid);
		});

		this.updateFighters();

		return () => {
			// Remove all fighters target, if the enemy is the same
			this.activeFighters.forEach((_, fighterUid) => {
				const fighterTargetUid = store.getState(selectFighterTarget(fighterUid));

				if (fighterTargetUid === undefined || fighterTargetUid !== enemyUid) {
					return;
				}

				this.fightersTracker.removeFighterTarget(fighterUid, enemyUid);
			});

			this.updateFighters();
		};
	}

	private onActiveFighter(uid: string) {
		print("new active fighter", uid);

		this.activeFighters.createFighterGoal(uid);
		this.updateFighters();

		return () => {
			this.activeFighters.removeFighterGoal(uid);
			this.updateFighters();
		};
	}
}

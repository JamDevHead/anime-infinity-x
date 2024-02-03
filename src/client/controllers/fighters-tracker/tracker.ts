import { createSelector } from "@rbxts/reflex";
import { Workspace } from "@rbxts/services";
import { Trove } from "@rbxts/trove";
import { ActiveFighters } from "@/client/controllers/fighters-tracker/active-fighters";
import { FightersTracker } from "@/client/controllers/fighters-tracker/tracker-controller";
import { store } from "@/client/store";
import { PlayerFighters } from "@/shared/store/players";
import { selectPlayerFighters } from "@/shared/store/players/fighters";

export class Tracker {
	public readonly userId: string;
	public readonly goalContainer = Workspace.Terrain;

	private trove = new Trove();
	private activeFighters = this.trove.add(new ActiveFighters(this.goalContainer));
	private root: Part | undefined;

	constructor(
		player: Player,
		public fightersTracker: FightersTracker,
	) {
		this.userId = tostring(player.UserId);

		task.spawn(() => {
			if (player.Character) {
				this.onCharacterAdded(player.Character);
			}
		});

		this.trove.add(player.CharacterAdded.Connect((character) => this.onCharacterAdded(character)));

		this.trove.add(player.CharacterRemoving.Connect(() => this.onCharacterRemoving()));

		const selectActiveFightersFromPlayer = createSelector(selectPlayerFighters(this.userId), (fighters) => {
			return fighters?.actives;
		});

		const activeFighterObserver = (fighter: { fighterId: string; characterId: string }) => {
			print("active fighter added");
			this.activeFighters.createFighterGoal(fighter.fighterId);
			this.updateFighters();

			return () => {
				this.activeFighters.removeFighterGoal(fighter.fighterId);
				this.updateFighters();
			};
		};

		const entityAdded = (fighter: { fighterId: string; characterId: string }) => {
			const doesNotHaveActiveFighter = (fighters?: PlayerFighters["actives"]) => {
				return fighters?.find((otherFighter) => otherFighter.fighterId === fighter.fighterId) === undefined;
			};

			const cleanup = activeFighterObserver(fighter);

			store.once(selectActiveFightersFromPlayer, doesNotHaveActiveFighter, () => cleanup());
		};

		this.trove.add(
			store.subscribe(selectActiveFightersFromPlayer, (current, previous) => {
				if (!current) {
					return;
				}

				for (const [key, value] of pairs(current)) {
					if (previous?.[key - 1] === undefined) {
						entityAdded(value);
					}
				}
			}),
		);
	}

	public destroy() {
		this.trove.destroy();
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

	private onCharacterAdded(character: Model) {
		this.root = character.WaitForChild("HumanoidRootPart") as Part;
		this.updateFighters();
	}

	private onCharacterRemoving() {
		this.root = undefined;
		// Cleanup previous fighters
		this.activeFighters.clear();
	}
}

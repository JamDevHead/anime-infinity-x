import { createSelector, shallowEqual } from "@rbxts/reflex";
import { Workspace } from "@rbxts/services";
import { Trove } from "@rbxts/trove";
import { FighterGoalAttributes } from "@/client/components/fighter-goal/fighter-goal-types";
import { FightersTracker } from "@/client/controllers/fighters-tracker/tracker-controller";
import { store } from "@/client/store";
import { ActivePlayerFighter } from "@/shared/store/players";
import { identifyActiveFighter, selectActiveFightersFromPlayer } from "@/shared/store/players/fighters";

export class Tracker {
	public readonly userId: string;

	private readonly goalContainer = Workspace.Terrain;
	private trove = new Trove();
	private activeFighters = new Map<ActivePlayerFighter, Attachment>();
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

		const selectActiveFightersFromLocalPlayer = createSelector(
			[selectActiveFightersFromPlayer(this.userId)],
			(fighters) => fighters ?? [],
			shallowEqual,
		);

		this.trove.add(
			store.observe(selectActiveFightersFromLocalPlayer, identifyActiveFighter, (fighter) => {
				this.activeFighters.set(fighter, new Instance("Attachment", this.goalContainer));
				this.updateFighters();

				return () => {
					this.activeFighters.delete(fighter);
					this.updateFighters();
				};
			}),
		);
	}

	public destroy() {
		this.trove.destroy();
	}

	private updateFighters() {
		if (!this.root) {
			return;
		}

		const troopSize = this.activeFighters.size();
		const formation = this.fightersTracker.getFormation(troopSize);
		const formationSize = formation.size();
		let index = 0;

		for (const [fighter, attachment] of this.activeFighters) {
			index++;

			const fighterGoal = formation[index % formationSize];
			const fighterOffset = this.fightersTracker.RootOffset.add(fighterGoal);
			const attributes = {
				...fighter,
				goalOffset: fighterOffset,
				playerId: this.userId,
			} satisfies FighterGoalAttributes;

			for (const [key, value] of pairs(attributes)) {
				attachment.SetAttribute(key, value);
			}

			attachment.WorldPosition = this.root.Position.add(fighterOffset);
			attachment.AddTag("FighterGoal");
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

import Make from "@rbxts/make";
import { createSelector, shallowEqual } from "@rbxts/reflex";
import { Workspace } from "@rbxts/services";
import { Trove } from "@rbxts/trove";
import { FighterGoalAttributes, FighterGoalInstance } from "@/client/components/fighter-goal/fighter-goal-types";
import { FightersTracker } from "@/client/controllers/fighters-tracker-controller/tracker-controller";
import { store } from "@/client/store";
import { ActivePlayerFighter } from "@/shared/store/players";
import { identifyActiveFighter, selectActiveFightersFromPlayer } from "@/shared/store/players/fighters";

export class Tracker {
	public readonly userId: string;

	private readonly goalContainer = Workspace.Terrain;
	private trove = new Trove();
	private activeFighters = new Map<ActivePlayerFighter, FighterGoalInstance>();
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

		const selectActiveFightersFromLocalPlayer = createSelector(
			[selectActiveFightersFromPlayer(this.userId)],
			(fighters) => fighters ?? [],
			shallowEqual,
		);

		this.trove.add(
			store.observe(selectActiveFightersFromLocalPlayer, identifyActiveFighter, (fighter) => {
				const goal = Make("Part", {
					Name: fighter.fighterId,
					Anchored: false,
					CanCollide: false,
					CanQuery: false,
					CanTouch: false,
					CastShadow: false,
					Size: Vector3.one,
					Transparency: 1,
					Parent: this.goalContainer,
				});

				Make("WeldConstraint", {
					Name: "weld",
					Part1: goal,
					Parent: goal,
				});

				this.activeFighters.set(fighter, goal as typeof goal & { weld: WeldConstraint });
				this.updateFighters();

				return () => {
					this.activeFighters.delete(fighter);
					goal.Destroy();
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

		for (const [fighter, goal] of this.activeFighters) {
			index++;

			const fighterGoal = formation[index % formationSize];
			const fighterOffset = new CFrame(this.fightersTracker.RootOffset.add(fighterGoal));
			const attributes = {
				...fighter,
				goalOffset: fighterOffset,
				playerId: tonumber(this.userId) as number,
			} satisfies FighterGoalAttributes;

			for (const [key, value] of pairs(attributes)) {
				goal.SetAttribute(key, value);
			}

			goal.weld.Enabled = false;

			goal.CFrame = this.root.CFrame.ToWorldSpace(fighterOffset);
			goal.weld.Part0 = this.root;

			goal.weld.Enabled = true;

			goal.AddTag("FighterGoal");
		}
	}

	private onCharacterAdded(character: Model) {
		this.root = character.WaitForChild("HumanoidRootPart") as Part;
		this.updateFighters();
	}
}

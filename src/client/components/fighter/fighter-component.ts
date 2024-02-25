import { BaseComponent, Component } from "@flamework/components";
import { OnPhysics, OnRender, OnStart, OnTick } from "@flamework/core";
import Make from "@rbxts/make";
import { Players } from "@rbxts/services";
import { Trove } from "@rbxts/trove";
import {
	FighterAnimator,
	FighterAttributes,
	FighterInstance,
	FighterModel,
	FighterPosition,
	knownEnemies,
} from "@/client/components/fighter";
import { FighterAttack } from "@/client/components/fighter/fighter-attack";
import { FighterSpecial } from "@/client/components/fighter/fighter-special";
import { FIGHTER_FAR_CFRAME, FIGHTER_GOAL_CONTAINER } from "@/client/constants/fighters";
import { FighterController } from "@/client/controllers/fighter-controller";
import { OnInput } from "@/client/controllers/lifecycles/on-input";

const raycastParams = new RaycastParams();
const localPlayer = Players.LocalPlayer;

@Component()
export class FighterComponent
	extends BaseComponent<FighterAttributes, FighterInstance>
	implements OnStart, OnTick, OnPhysics, OnRender, OnInput
{
	private readonly player: Player;
	private root?: BasePart;
	private humanoid?: Humanoid;

	private trove = new Trove();
	private goalOffset?: CFrame;

	private goal = this.trove.add(
		Make("Part", {
			Name: this.attributes.fighterId,
			Anchored: false,
			CanCollide: false,
			CanQuery: false,
			CanTouch: false,
			CastShadow: false,
			Massless: true,
			Size: Vector3.one,
			Transparency: 1,
			Parent: FIGHTER_GOAL_CONTAINER,
		}) as Part & { Weld: WeldConstraint | undefined },
	);

	private fighterPosition = new FighterPosition(this.instance, this.attributes.fighterId, this.goal, raycastParams);
	private fighterAnimator = new FighterAnimator(this.trove, this.instance, raycastParams);
	private fighterModel = new FighterModel(this.trove, this.instance, this.goal);
	private fighterSpecial?: FighterSpecial;
	private fighterAttack = new FighterAttack(
		this.attributes.playerId,
		this.attributes.fighterId,
		this.fighterAnimator,
	);

	constructor(private readonly fighterController: FighterController) {
		super();

		const userId = tonumber(this.attributes.playerId) as number;
		const player = Players.GetPlayerByUserId(userId);

		assert(player, `[Fighters] Player ${userId} was not found`);

		this.player = player;

		if (this.player === localPlayer) {
			this.fighterSpecial = this.trove.add(
				new FighterSpecial(this.trove, this.instance, this.attributes.fighterId, this.fighterAttack),
			);
		}
	}

	destroy() {
		super.destroy();
		this.trove.destroy();
	}

	onStart() {
		const setCharacterChildren = (character: Model) => {
			this.root = character.WaitForChild("HumanoidRootPart") as BasePart;
			this.humanoid = character.WaitForChild("Humanoid") as Humanoid;

			this.goal.FindFirstChild("WeldConstraint")?.Destroy();

			this.instance.PivotTo(this.goal.CFrame);

			Make("WeldConstraint", {
				Part0: this.root,
				Part1: this.goal,
				Parent: this.goal,
			});

			if (this.goalOffset) {
				this.updateFighterGoal(this.goalOffset);
			}
		};

		this.trove.add(this.player.CharacterAdded.Connect((character) => setCharacterChildren(character)));

		if (this.player.Character) {
			setCharacterChildren(this.player.Character);
		}
	}

	onInputBegan(input: InputObject, gameProcessedEvent: boolean) {
		this.fighterSpecial?.onUserInput(input, gameProcessedEvent);
	}

	onPhysics(dt: number) {
		task.spawn(() => this.fighterModel.onPhysics());
		task.spawn(() => this.fighterAnimator.onPhysics(dt, this.humanoid, !!this.fighterController.getCurrentEnemy()));
	}

	onRender() {
		this.fighterSpecial?.onRender(!!this.fighterController.getCurrentEnemy());
	}

	onTick(dt: number) {
		if (!this.goalOffset) return;

		const currentCFrame = this.fighterPosition.onTick();

		const fighterPosition = this.fighterPosition;
		const currentEnemy = this.fighterController.getCurrentEnemy();

		const fighterGoalCFrame =
			(currentEnemy && fighterPosition.getFighterPositionOnEnemy(currentEnemy, knownEnemies)) ||
			fighterPosition.getFighterPosition(this.goalOffset, currentCFrame, this.humanoid);

		if (fighterGoalCFrame === FIGHTER_FAR_CFRAME && currentCFrame !== FIGHTER_FAR_CFRAME) {
			this.fighterModel.puff();
		}

		this.fighterPosition.setCurrentCFrame(currentCFrame, fighterGoalCFrame, dt * 8);
	}

	public updateFighterGoal(offset: CFrame) {
		this.goalOffset = offset;

		if (!this.root || !this.humanoid) return;

		const weld = this.goal.FindFirstChild("WeldConstraint") as WeldConstraint | undefined;

		if (!weld) return;

		weld.Enabled = false;
		this.goal.CFrame = this.root.CFrame.ToWorldSpace(offset);
		weld.Enabled = true;
	}

	public attack() {
		this.fighterAttack.attack();
	}
}

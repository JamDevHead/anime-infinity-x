import { BaseComponent, Component } from "@flamework/components";
import { OnPhysics, OnRender, OnStart } from "@flamework/core";
import Gizmo from "@rbxts/gizmo";
import { Logger } from "@rbxts/log";
import { Workspace } from "@rbxts/services";
import { Trove } from "@rbxts/trove";
import { FighterGoal } from "@/client/components/fighter-goal";
import { FightersTracker } from "@/client/controllers/fighters-tracker";
import { CharacterAdd } from "@/client/controllers/lifecycles/on-character-add";
import { AnimationMap, AnimationTracker } from "@/shared/lib/animation-tracker";
import { calculateStun } from "@/shared/utils/fighters";

interface IFighterModel extends Model {
	Humanoid: Humanoid & {
		Animator: Animator;
	};
}

const animationMap = {
	idle: { id: "14451184535" },
	walk: { id: "14678864223" },
	run: { id: "14678864223" },
	jump: { id: "125750702" },
	fall: { id: "15484732189" },
	soco1: { id: "15461463119" },
	soco2: { id: "15461470426" },
} satisfies AnimationMap;

@Component({ tag: "Fighter" })
export class FighterModel
	extends BaseComponent<NonNullable<unknown>, IFighterModel>
	implements OnStart, OnRender, OnPhysics
{
	public fighterGoal!: FighterGoal;

	private humanoid = this.instance.Humanoid;
	private torso = this.instance.FindFirstChild("Torso") as Part | undefined;
	private animator = this.humanoid.Animator;
	private animationTracker = new AnimationTracker(this.animator, animationMap);
	private trove = new Trove();
	private lastFighterPosition = Vector3.zero;
	private fighterVelocity = 0;
	private collidableParts = new Set<BasePart>();
	private raycastParams = new RaycastParams();
	private currentState: Enum.HumanoidStateType = Enum.HumanoidStateType.None;
	private fighterStun = 0;
	private attackState = 1;

	constructor(
		private readonly logger: Logger,
		private readonly characterAdd: CharacterAdd,
		private readonly fightersTracker: FightersTracker,
	) {
		super();
	}

	onStart() {
		const root = this.humanoid.RootPart;

		if (!root) {
			this.logger.Warn("Failed to find fighter root");
			return;
		}

		// Setup fighter root
		root.Anchored = true;

		// Cleanup fighter model
		for (const part of this.instance.GetDescendants()) {
			if (part.IsA("BasePart")) {
				part.CanCollide = false;
				part.CanQuery = false;
				part.CanTouch = false;

				if (part === root) {
					continue;
				}

				this.collidableParts.add(part);
				part.Anchored = false;
			}
		}

		// Setup raycast params
		this.raycastParams.FilterType = Enum.RaycastFilterType.Exclude;
		this.raycastParams.AddToFilter(this.fightersTracker.fightersFolder);

		// Setup fighter pivot
		const [currentPivot, fighterSize] = this.instance.GetBoundingBox();
		const halfFighterSize = fighterSize.Y / 2;

		this.instance.PrimaryPart = undefined;
		this.instance.WorldPivot = currentPivot.sub(Vector3.yAxis.mul(halfFighterSize));

		// Setup fighter highlight
		const highlight = new Instance("Highlight");
		highlight.FillTransparency = 1;
		highlight.OutlineTransparency = 0;
		highlight.DepthMode = Enum.HighlightDepthMode.Occluded;
		highlight.OutlineColor = Color3.fromRGB();
		highlight.Parent = this.instance;

		// Setup fighter cleanup
		this.trove.add(() => this.animationTracker.destroy());
		this.trove.add(this.instance);
	}

	onPhysics() {
		if (!this.torso) {
			return;
		}

		this.collidableParts.forEach((part) => {
			part.CanCollide = false;
		});
	}

	onRender(dt: number) {
		this.fighterStun = math.max(this.fighterStun - dt, 0);

		const character = this.characterAdd.character;
		const humanoid = character?.FindFirstChild("Humanoid") as Humanoid | undefined;

		if (!this.humanoid?.RootPart || !humanoid) {
			return;
		}

		// Update fighter model
		this.instance.PivotTo(this.fighterGoal.fighterPart.CFrame);

		const root = this.humanoid.RootPart;
		const distance = root.Position.sub(this.lastFighterPosition).Magnitude;

		this.fighterVelocity = distance > 0.15 ? distance / math.max(dt, 0.02) : 0;
		this.lastFighterPosition = root.Position;

		const isFalling = !this.isGrounded();
		const isJumping = humanoid.Jump && this.fighterGoal.currentEnemy === undefined;
		const isRunning = this.fighterVelocity > 0.2;
		const animationTracker = this.animationTracker;

		if (animationTracker.isAnimationPlaying("soco1") || animationTracker.isAnimationPlaying("soco2")) {
			return;
		}

		let newState = this.currentState;

		switch (true) {
			case isJumping:
				if (newState !== Enum.HumanoidStateType.Jumping) {
					newState = Enum.HumanoidStateType.Jumping;
					animationTracker.swapAnimation("jump");
				}
				break;
			case isFalling:
				if (newState !== Enum.HumanoidStateType.FallingDown) {
					newState = Enum.HumanoidStateType.FallingDown;
					animationTracker.swapAnimation("fall");
				}
				break;
			case isRunning:
				if (newState !== Enum.HumanoidStateType.Running) {
					newState = Enum.HumanoidStateType.Running;
					animationTracker.getAnimationTrack("run")?.AdjustSpeed(this.fighterVelocity / 16);
					animationTracker.swapAnimation("run");
				}
				break;
			default:
				if (newState !== Enum.HumanoidStateType.Landed) {
					newState = Enum.HumanoidStateType.Landed;
					animationTracker.swapAnimation("idle");
				}
				break;
		}

		this.currentState = newState;
	}

	destroy() {
		super.destroy();
		this.trove.destroy();
	}

	private isGrounded() {
		const origin = this.instance.GetPivot().Position.add(Vector3.yAxis.mul(1.5));
		const direction = Vector3.yAxis.mul(-2.75);
		const groundHit = Workspace.Raycast(origin, direction, this.raycastParams);

		Gizmo.arrow.styleDraw(
			{ color: groundHit ? Color3.fromRGB(255, 0, 0) : Color3.fromRGB(0, 255, 0), scale: 0.2 },
			origin,
			groundHit?.Position ?? origin.add(direction),
		);

		return groundHit !== undefined;
	}

	public attack() {
		const dexterity = this.fighterGoal.fighterInfo?.stats.dexterity ?? 10;

		if (this.fighterStun > 0) {
			return;
		}

		this.fighterStun = calculateStun(dexterity);

		this.attackState = this.attackState === 1 ? 2 : 1;
		this.animationTracker.swapAnimation(`soco${this.attackState}`);
	}
}
